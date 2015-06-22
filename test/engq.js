var chai = require("chai")
var chaiAsPromised = require("chai-as-promised")

chai.should()
chai.use(chaiAsPromised)

var assert = chai.assert

var oodle = require('./build/bundle.js')

describe('Engineering Quantity', function () {

    before(function() {
        this.engq = new oodle.EngQ(12, "kg")
    })

    it('should have the values assigned', function() {
        assert.equal(this.engq.val, 12)
        assert.equal(this.engq.units, "kg")
    })

    it('should reflect the updated values on change', function() {
        this.engq.val = 10
        this.engq.units = "g"

        assert.equal(this.engq.val, 10)
        assert.equal(this.engq.units, "g")
    })
})
