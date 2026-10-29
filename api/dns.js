import dns from 'node:dns/promises';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const name = (req.query?.name || req.body?.name || '').replace(/^https?:\/\//i, '').split('/')[0].split(':')[0].trim();
  const type = (req.query?.type || req.body?.type || 'A').toUpperCase();

  if (!name) {
    return res.status(400).json({ error: 'Missing name parameter', Status: 2 });
  }

  try {
    let answers = [];

    if (type === 'A') {
      try {
        const ips = await dns.resolve4(name);
        answers = ips.map((ip) => ({ type: 1, data: ip, TTL: 300 }));
      } catch (err) {
        // Fallback to CNAME if no direct A records
        try {
          const cnames = await dns.resolveCname(name);
          answers = cnames.map((cn) => ({ type: 5, data: cn, TTL: 300 }));
          // Also try resolving the target of CNAME
          if (cnames.length > 0) {
            try {
              const targetIps = await dns.resolve4(cnames[0]);
              answers.push(...targetIps.map((ip) => ({ type: 1, data: ip, TTL: 300 })));
            } catch {}
          }
        } catch {}
      }
    } else if (type === 'TXT') {
      try {
        const records = await dns.resolveTxt(name);
        answers = records.flat().map((t) => ({ type: 16, data: t, TTL: 300 }));
      } catch {}
    } else if (type === 'MX') {
      try {
        const records = await dns.resolveMx(name);
        answers = records.map((m) => ({ type: 15, data: m.exchange, priority: m.priority, TTL: 300 }));
      } catch {}
    } else if (type === 'NS') {
      try {
        const records = await dns.resolveNs(name);
        answers = records.map((ns) => ({ type: 2, data: ns, TTL: 300 }));
      } catch {}
    }

    const hasRecords = answers.length > 0;
    return res.status(200).json({
      Status: hasRecords ? 0 : 3,
      Answer: answers,
      name,
      type
    });
  } catch (err) {
    const isNx = err.code === 'ENOTFOUND' || err.code === 'ENODATA';
    return res.status(200).json({
      Status: isNx ? 3 : 2,
      Answer: [],
      error: err.code || err.message,
      name,
      type
    });
  }
}
