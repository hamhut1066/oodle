var chai = require("chai")
var chaiAsPromised = require("chai-as-promised")

chai.should()
chai.use(chaiAsPromised)

var assert = chai.assert

var oodle = require('./build/bundle.js')

describe('Calculation', function() {

    beforeEach(function() {
        this.calc = new oodle.Calc({
            "A": new oodle.EngQ(10, "m/s^2"),
            "M": new oodle.EngQ(5, "kg")
        }, function(c) {
            return new oodle.EngQ(c.A.val * c.M.val, "F")
        })
    })

    it('should have the correct default structure', function() {
        assert.equal(this.calc.A.val, 10)
        assert.equal(this.calc.M.val, 5)
    })

    it('should run the calculation and return the correct value', function(done) {
        this.calc.run().should.be.fulfilled.then(function(out) {
            assert.equal(out.val, 50)
            assert.equal(out.units, "F")
        }).should.notify(done)

    })

    it('should have populated the .out of the calc', function(done) {
        var that = this
        this.calc.run().should.be.fulfilled.then(function(out) {
            assert.equal(that.calc.out, out)
        }).should.notify(done)
    })
})
