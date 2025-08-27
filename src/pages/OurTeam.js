import React from 'react';

const TEAM = [
  {
    name: 'Prince',
    email: 'princee0391@gmail.com',
    linkedin: 'https://www.linkedin.com/in/prince1930',
    github: 'https://github.com/prince-073',
  },
  {
    name: 'Aarti Bismille',
    email: 'artibismille8956@gmail.com',
    linkedin: 'https://www.linkedin.com/in/aarti-bismille-649740244/',
    github: 'https://github.com/Artibismille',
  },
  {
    name: 'Mahek Mulla',
    email: 'mahekmulla30@gmail.com',
    linkedin: 'https://www.linkedin.com/in/mahek-mulla-2a931a289',
    github: 'https://github.com/mahekmulla05',
  },
  {
    name: 'Raju Kumbhakar',
    email: 'rajukumbhakar6204@gmail.com',
    linkedin: 'https://www.linkedin.com/in/raju-kumbhakar',
    github: 'https://github.com/raju-kumbhakar',
  },
  {
    name: 'Mohan C N',
    email: 'mohancn2002mohan@gmail.com',
    linkedin: 'https://www.linkedin.com/in/mohan-c-n-130711228',
    github: 'https://github.com/Mohancn842',
  },
  {
    name: 'Rakshith M',
    email: 'rakshithm6361@gmail.com',
    linkedin: 'https://www.linkedin.com/in/rakshith-m-553232258',
    github: 'https://github.com/raks2607',
  },
  {
    name: 'Isha Biraris',
    email: 'ishabiraris31@gmail.com',
    linkedin: 'https://www.linkedin.com/in/isha-biraris-606415321',
    github: 'https://github.com/Isha31-web',
  },
];

const Avatar = ({ name }) => {
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  return (
    <div
      className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-2xl text-white font-bold shadow"
      aria-hidden
    >
      {initial}
    </div>
  );
};

const IconLinkedIn = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 11.268h-3v-5.604c0-1.337-.027-3.059-1.864-3.059-1.865 0-2.151 1.455-2.151 2.959v5.704h-3v-10h2.881v1.367h.041c.401-.76 1.379-1.563 2.839-1.563 3.037 0 3.6 2.001 3.6 4.604v5.592z"/>
  </svg>
);

const IconGithub = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 .5a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.41-1.34-1.78-1.34-1.78-1.09-.74.08-.72.08-.72 1.2.09 1.83 1.24 1.83 1.24 1.07 1.84 2.82 1.31 3.51 1 .11-.79.42-1.31.76-1.61-2.67-.3-5.48-1.34-5.48-5.97 0-1.32.47-2.39 1.24-3.23-.12-.3-.54-1.51.12-3.16 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.86.12 3.16.77.84 1.24 1.91 1.24 3.23 0 4.64-2.81 5.66-5.49 5.96.43.37.81 1.1.81 2.22 0 1.6-.01 2.88-.01 3.27 0 .32.21.69.82.58A12 12 0 0012 .5z"/>
  </svg>
);

const TeamCard = ({ member }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-2xl">
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-blue-600/30 to-purple-700/30 blur-2xl group-hover:scale-110 transition-transform" />
      <div className="p-5 flex items-center gap-4 relative">
        <Avatar name={member.name} />
        <div className="min-w-0">
          <div className="text-white font-extrabold text-lg truncate">{member.name}</div>
          <a href={`mailto:${member.email}`} className="text-gray-300 text-sm hover:text-white truncate block">{member.email}</a>
          <div className="flex gap-2 mt-3 text-sm">
            <a href={member.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-blue-200 hover:bg-white/20">
              <IconLinkedIn />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
            <a href={member.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-gray-200 hover:bg-white/20">
              <IconGithub />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const OurTeam = () => {
  // Leader featured at the top. Change this name to set who is the leader.
  const leaderName = 'Prince';
  const leader = TEAM.find((m) => (m.name || '').toLowerCase() === leaderName.toLowerCase());
  const teamWithoutLeader = leader ? TEAM.filter((m) => m.email !== leader.email) : TEAM;

  // Girls left (specific order): Isha, Mahek, Arti
  const girlsOrder = ['Isha Biraris', 'Mahek Mulla', 'Aarti Bismille'];
  const girls = girlsOrder
    .map((g) => teamWithoutLeader.find((m) => (m.name || '').toLowerCase() === g.toLowerCase()))
    .filter(Boolean);

  // Boys right = remaining after removing girls; random order
  const boys = teamWithoutLeader
    .filter((m) => !girls.some((g) => g.email === m.email))
    .sort(() => 0.5 - Math.random());

  return (
    <div className="min-h-[calc(100vh-96px)] w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10">
      {/* Subtle decorative backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-56 h-56 bg-fuchsia-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-white">Our Team</h1>
        <p className="text-gray-300">Celebrating our amazing teammates</p>
      </div>

      {/* Leader section */}
      {leader && (
        <div className="flex justify-center mb-8">
          <div className="relative w-full sm:w-[560px]">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400/40 to-pink-500/30 rounded-3xl blur opacity-70" aria-hidden />
            <div className="relative rounded-3xl">
              <div className="absolute right-4 top-4 z-10">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 border border-amber-400/40 text-amber-200">Leader</span>
              </div>
              <TeamCard member={leader} />
            </div>
          </div>
        </div>
      )}

      {/* Two-column split: Girls | Boys */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Girls column */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-pink-400/40 to-transparent" />
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/20 border border-pink-400/40 text-pink-200">Girls</span>
          </div>
          <div className="space-y-4">
            {girls.map((m, idx) => (
              <TeamCard key={`g-${idx}`} member={m} />
            ))}
          </div>
        </div>

        {/* Boys column */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 border border-blue-400/40 text-blue-200">Boys</span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-blue-400/40 to-transparent" />
          </div>
          <div className="space-y-4">
            {boys.map((m, idx) => (
              <TeamCard key={`b-${idx}`} member={m} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurTeam;
