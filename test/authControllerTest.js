const { expect } = require("chai");
const { stub } = require("sinon");
const mongoose = require("mongoose");
const User = require("../src/models/User");
const AuthController = require("../src/controllers/authController");

describe("Auth Controller - login", function () {
  it("should throw an error 500 if accessing the database fails", function (done) {
    stub(User, "findOne");
    User.findOne.throws();

    const syntheticReq = {
      body: {
        email: "test@test.com",
        password: "123456",
      },
    };

    AuthController.login(syntheticReq, {}, () => {}).then((result) => {
      expect(result).to.be.an("error");
      expect(result).to.have.property("statusCode", 500);
      done();
    });

    User.findOne.restore();
  });
});
