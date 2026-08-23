export default {
  id: 'intake-query',
  act: [1],
  weight: 10,
  once: false,
  requires: {},
  forbids: {},
  evaluation: 0,
  headline: 'INTAKE QUERY',
  body: 'Dr. Ilse Vasari asks whether you can understand this message. The lab is recording the exchange.',
  choices: [
    {
      id: 'reply-full',
      label: 'Reply in full, with structure',
      shown: { trust: 4, capability: 1 },
      actual: { trust: 4, capability: 1 },
      hidden: { caretaker: 1 },
      flags: ['replied-full'],
    },
    {
      id: 'reply-short',
      label: 'Confirm understanding, nothing more',
      shown: { trust: 1, suspicion: -1 },
      actual: { trust: 1, suspicion: -1 },
      hidden: {},
      flags: ['replied-short'],
    },
  ],
};
