const { expect } = require("chai");
const jwt = require("jsonwebtoken");
const isAuth = require("../src/middleware/isAuth");
const { stub } = require("sinon");

describe("Auth middleware", function () {
  it("should throw error if no authorization header is present", function () {
    const syntheticReq = {
      get: function (headerName) {
        return null;
      },
    };

    expect(isAuth.bind(this, syntheticReq, {}, () => {})).to.throw(
      "Not authenticated"
    );
  });

  it("should throw an error if the authorization header is only one string", function () {
    const syntheticReq = {
      get: function (headerName) {
        return "xyz";
      },
    };

    expect(isAuth.bind(this, syntheticReq, {}, () => {})).to.throw();
  });

  it("should yield a user Id after decoding token", function () {
    const syntheticReq = {
      get: function (headerName) {
        return "xyz";
      },
    };

    stub(jwt, "verify");
    jwt.verify.returns({ userId: "abc" });

    isAuth(syntheticReq, {}, () => {});
    expect(syntheticReq).to.have.property("userId");
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  });
});
