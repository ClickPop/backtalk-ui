const anonymousNicknamesList = [
  'An internet friend',
  'Someone awesome',
  'A neat person',
  'Anonymous & bonhomous',
  'One cool cat',
  'A nifty pal',
  'Amazing human',
];

export default () => {
  return anonymousNicknamesList[
    Math.floor(Math.random() * anonymousNicknamesList.length)
  ];
};
