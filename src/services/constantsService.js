export default Object.freeze({
  sessionKey: "user",

  sessionBaseURLKey: "baseURL",

  cryptoBaseURLKey: "Coke-Login-BaseURL",

  loginBaseURL: "http://localhost:7777/",

  dynamicBaseURL: (PORT) => "http://localhost:" + PORT + "/",

  dynamicBaseURLPORT: (companyId) => {
    return 7777;
  },

  correctExpiry: (expiry) =>
    expiry.substr(3, 2) + "-" + expiry.substr(0, 2) + expiry.substr(5),
});
