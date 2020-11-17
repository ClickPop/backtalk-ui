const anonymousNicknamesList = [
  'An internet friend',
  'Someone awesome',
  'A neat person',
  'Anonymous & bonhomous',
];

export default () => {
  return anonymousNicknamesList[
    Math.floor(Math.random() * anonymousNicknamesList.length)
  ];
};
