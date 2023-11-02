import chai from "chai";
import chaiHttp from "chai-http"
import app from "../src/app";
import { connectWithRetry, mongoose } from "../src/service/mongooseService";
import { deleteUserByEmail } from "../src/models/auth/UserModel";
import test, { describe } from "node:test";
import { after, before } from "mocha";
const expect = chai.expect;
chai.use(chaiHttp);

describe('API TESTS for REGISTRATION and LOGIN ', () => {
    before(function () {
        this.timeout(15000);
        return new Promise((res, rej) => {
            mongoose.connect('mongodb+srv://developergusioni7:5fw97gjp1Q0vOKoa@cluster0.nzxzysy.mongodb.net/?retryWrites=true&w=majority')
                .then(() => {
                    console.log("connected")
                    res("success")

                }).catch((err) => {
                    rej(err)

                })
        })
    });

    const sampleusername = "john doe";
    const sampleemail = "test123@gmail.com";
    const password = "Test@123";
    const sampleemail2 = "johndoetest123@gmail.com"
    const samplepass2 = "pass1"

    it(`Register new user using proper details. Username: ${sampleusername}, email: ${sampleemail}, password: ${password}`, function (done: Mocha.Done) {
        this.timeout(5000)
        try {
            chai.request(app).post("/api/users/register").send({ email: sampleemail, password, username: sampleusername })
                .end(function (err, result) {
                    if (err) {
                        done(err);
                    }
                    expect(result).to.have.status(200);
                    expect(result.body).to.have.property('success', true)
                    console.log("Response msg from server : ",result.body);
                    done();
                });
        } catch (error) {
            console.error(error);
            done(error) // Re-throw the error to ensure the test fails if there is an error
        }
    });
    it(`Register user using existing email , Registration will be failed because email already exists . Username: ${sampleusername}, email: ${sampleemail}, password: ${password}`, function (done: Mocha.Done) {
        this.timeout(5000)
        try {
            chai.request(app).post("/api/users/register").send({ email: sampleemail, password, username: sampleusername })
                .end(function (err, result) {
                    if (err) {
                        done(err);
                    }
                    expect(result.body).to.have.property('success', false)
                    console.log("Response msg From Server : ",result.body);
                    done();
                });
        } catch (error) {
            console.error(error);
            done(error) // Re-throw the error to ensure the test fails if there is an error
        }
    });

    it(`Register user using invalid password pattern , Registration will be failed because pass patern is  not proper . Username: ${sampleusername}, email: ${sampleemail2}, password: ${password}`, function (done: Mocha.Done) {
        this.timeout(5000)
        try {
            chai.request(app).post("/api/users/register").send({ email: sampleemail2, password:samplepass2, username: sampleusername })
                .end(function (err, result) {
                    if (err) {
                        done(err);
                    }
                    expect(result.body).to.have.property('success', false)
                    console.log("Response msg From Server : ",result.body);
                    done();
                });
        } catch (error) {
            console.error(error);
            done(error) // Re-throw the error to ensure the test fails if there is an error
        }
    });

    console.log("-------------------------TEST END FOR REGISTRATION----------------------------")
    it(`TRY TO LOGIN USING FOLLOWING EMAIL PASS WHICH WE HAVE REGISTER ABOVE FOR TEST : ${sampleusername}, email: ${sampleemail}, password: ${password}`, function (done: Mocha.Done) {
        this.timeout(5000)
        try {
            chai.request(app).post("/api/users/login").send({ email: sampleemail, password })
                .end(function (err, result) {
                    if (err) {
                        done(err);
                    }
                    expect(result).to.have.status(200);
                    expect(result.body).to.have.property('success', true)
                    console.log("Response msg from server : ",result.body);
                    done();
                });
        } catch (error) {
            console.error(error);
            done(error) // Re-throw the error to ensure the test fails if there is an error
        }
    });
    it(`TRY TO LOGIN USING FOLLOWING EMAIL WITH WRONG PASS : ${sampleusername}, email: ${sampleemail}, password: ${samplepass2}`, function (done: Mocha.Done) {
        this.timeout(5000)
        try {
            chai.request(app).post("/api/users/login").send({ email: sampleemail, password:samplepass2 })
                .end(function (err, result) {
                    if (err) {
                        done(err);
                    }
                    expect(result.body).to.have.property('success', false)
                    console.log("Response msg from server : ",result.body);
                    done();
                });
        } catch (error) {
            console.error(error);
            done(error) // Re-throw the error to ensure the test fails if there is an error
        }
    });
    
    after(function(){
        deleteUserByEmail(sampleemail).then(()=>{
            console.log("TEST ENDED")
            console.log("Sample user deleted from db .")
        })
    })
});
