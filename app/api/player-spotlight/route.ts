export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Known player data seeded from real stats - Claude enriches and varies this
const PLAYER_SEED_DATA: Record<string, any[]> = {
  chaos: [
    {
      name: 'Blaze Riorden',
      number: '30',
      position: 'Goalie',
      hometown: 'Fairport, NY',
      college: 'University at Albany',
      facts: '5x Oren Lyons Goalie of the Year. 2021 PLL MVP and Champion. Set the PLL single-game save record with 25 saves on June 6 2025 vs Denver Outlaws. 59.4% save percentage in 2025. Widely called "once in a generation talent" by the PLL. Plays NLL forward for Philadelphia Wings. Known for butterfly style similar to hockey goalies. Made coast-to-coast goal vs Cornell in NCAA Tournament nominated for ESPY Best Play. Has 9 career 20+ save games — only 10 such games exist among all other PLL goalies combined.',
    },
    {
      name: 'Jack Rowlett',
      number: '4',
      position: 'Close Defense',
      hometown: 'Chesapeake, VA',
      college: 'Duke University',
      facts: '3x PLL All-Star. 2021 PLL Champion with Carolina Chaos. Considered one of the top close defenders in professional lacrosse. Teams with Jarrod Neumann to form arguably the best defensive tandem in the PLL. Known for his physicality and elite one-on-one defense.',
    },
    {
      name: 'Jarrod Neumann',
      number: '22',
      position: 'Close Defense',
      hometown: 'Smithtown, NY',
      college: 'Cornell University',
      facts: '2024 PLL All-Star. 2021 PLL Champion. Specialty is covering left-handed attackmen — considered the best in the league at this matchup. Alongside Rowlett forms a world-class close defense pairing. Key part of Carolina allowing only 11.0 goals per game in 2025, best in PLL.',
    },
    {
      name: 'Shane Knobloch',
      number: '11',
      position: 'Attack',
      hometown: 'Charlotte, NC',
      college: 'Duke University',
      facts: 'Won the 2026 PLL Golden Stick Award with 30 points in the Championship Series — the highest total in the competition. Local Charlotte product playing for his home city team. Key offensive weapon in Roy Colsey\'s new offensive system. Led the Chaos to their 2026 championship title.',
    },
    {
      name: 'Troy Reh',
      number: '14',
      position: 'Long-Stick Midfielder',
      hometown: 'Glen Cove, NY',
      college: 'University at Albany',
      facts: 'Elite long-stick midfielder who has anchored the Carolina defensive midfield for 6 seasons. Albany teammate of Blaze Riorden. Key piece of the Chaos defensive system that allowed the fewest goals per game in the PLL in 2025. Known for his ability to cover elite midfielders and contribute in transition.',
    },
  ],
  archers: [
    { name: 'Tom Schreiber', number: '7', position: 'Attack', hometown: 'Huntington, NY', college: 'Princeton', facts: 'One of the most prolific scorers in PLL history. Multiple All-Star selections. Elite dodger and finisher.' },
  ],
  outlaws: [
    { name: 'Lyle Thompson', number: '4', position: 'Attack', hometown: 'Onondaga Nation, NY', college: 'Albany', facts: 'Native American lacrosse legend. Three-time Tewaaraton Award winner. One of the greatest players in the history of the sport.' },
  ],
  cannons: [
    { name: 'Connor Martin', number: '2', position: 'Midfield', hometown: 'Boston, MA', college: 'Notre Dame', facts: 'Boston Cannons captain. Elite two-way midfielder known for his athleticism and work rate.' },
  ],
  whipsnakes: [
    { name: 'Matt Rambo', number: '1', position: 'Attack', hometown: 'Berwyn, PA', college: 'Maryland', facts: 'Multiple-time PLL champion with Whipsnakes. One of the most dangerous finishers in the league.' },
  ],
  atlas: [
    { name: 'Jeff Teat', number: '17', position: 'Attack', hometown: 'Carthage, NY', college: 'Cornell', facts: '28 goals and 36 assists in 2024, leading the Atlas to their first PLL championship in 2025. Tewaaraton Award winner.' },
  ],
  waterdogs: [
    { name: 'Trevor Baptiste', number: '5', position: 'Faceoff', hometown: 'Aurora, CO', college: 'Denver', facts: 'Most dominant faceoff specialist in PLL history. Multiple Faceoff Player of the Year awards.' },
  ],
  redwoods: [
    { name: 'Myles Jones', number: '3', position: 'Midfield', hometown: 'Catonsville, MD', college: 'Duke', facts: 'PLL All-Star midfielder. Dual threat on offense and defense. Key piece of California Redwoods system.' },
  ],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get('team') || 'chaos';
  const playerIndex = searchParams.get('player');

  const players = PLAYER_SEED_DATA[teamId] || PLAYER_SEED_DATA.chaos;

  // Rotate daily or use requested index
  const day = Math.floor(Date.now() / 86400000);
  const idx = playerIndex !== null
    ? parseInt(playerIndex) % players.length
    : day % players.length;

  const player = players[idx];

  // Use Claude API to generate a rich, editorial spotlight
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are a professional sports writer for a PLL lacrosse fan site. 
Generate compelling, accurate player spotlight content based on the facts provided.
Respond ONLY with a JSON object, no markdown, no backticks.
The JSON must have exactly these fields:
{
  "headline": "short punchy 4-6 word headline about the player",
  "tagline": "one sentence that captures their essence (10-15 words)",
  "description": "2-3 sentence editorial bio (60-80 words) that sounds like ESPN magazine",
  "stats": [
    {"label": "stat name", "value": "stat value"},
    {"label": "stat name", "value": "stat value"},
    {"label": "stat name", "value": "stat value"},
    {"label": "stat name", "value": "stat value"}
  ],
  "quote": "a real or plausible quote from this player about lacrosse or their team (1-2 sentences)",
  "accolades": ["accolade 1", "accolade 2", "accolade 3"]
}`,
        messages: [{
          role: 'user',
          content: `Generate a player spotlight for: ${player.name}, #${player.number}, ${player.position} for the PLL team.
Known facts: ${player.facts}
Hometown: ${player.hometown}, College: ${player.college}
Make it exciting and specific. Use real stats from the facts provided.`,
        }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    let aiContent;
    try {
      const clean = text.replace(/```json|```/g, '').trim();
      aiContent = JSON.parse(clean);
    } catch {
      // Fallback if parse fails
      aiContent = {
        headline: `${player.name.split(' ')[1]} Leads The Way`,
        tagline: `The ${player.position} setting the standard in professional lacrosse.`,
        description: player.facts.slice(0, 200),
        stats: [{ label: 'Position', value: player.position }, { label: 'Number', value: `#${player.number}` }],
        quote: 'Every game I go out there to be the best version of myself.',
        accolades: ['PLL Professional'],
      };
    }

    return Response.json({
      ...player,
      ...aiContent,
      playerIndex: idx,
      totalPlayers: players.length,
      teamId,
    });
  } catch (err: any) {
    // Return static data if AI call fails
    return Response.json({
      ...player,
      headline: `${player.name} — Elite ${player.position}`,
      tagline: `One of the best ${player.position.toLowerCase()}s in professional lacrosse.`,
      description: player.facts.slice(0, 300),
      stats: [
        { label: 'Position', value: player.position },
        { label: 'Number', value: `#${player.number}` },
        { label: 'College', value: player.college },
        { label: 'Hometown', value: player.hometown },
      ],
      quote: 'We play for each other every single game.',
      accolades: ['PLL Professional Player'],
      playerIndex: idx,
      totalPlayers: players.length,
      teamId,
      error: err.message,
    });
  }
}
