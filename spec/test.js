var expect  = require('chai').expect;
var request = require('supertest');
var exec = require('child_process').exec;

//const child = exec('cat file.txt | regmatch "code: (\\d+).*guid: (.*-.*-.*-.*)" --modifiers g --format \'$0 $1\'',

// var child = exec('cat file.txt | ' + __dirname + '/../regmatch "code: (\\d+).*guid: (.*-.*-.*-.*)" --modifiers g --format \'$0 $1\'', function(error, stdout, stderr) {
//     expect(stdout).to.equal('');
// });

describe('regmatch', function() {
  describe('missing parameters', function() {

    it('should show no output when missing regex and data', function(done) {
      var child = exec('echo "" | ' + __dirname + '/../regmatch', function(error, stdout, stderr) {
        expect(stdout.trim()).to.equal('');
        done();
      });
    });

    it('should show no output when missing regex', function(done) {
      var child = exec('cat file.txt | ' + __dirname + '/../regmatch', function(error, stdout, stderr) {
        expect(stdout.trim()).to.equal('');
        done();
      });
    });

    it('should show no output when missing data', function(done) {
      var child = exec('echo "" | ' + __dirname + '/../regmatch "blah"', function(error, stdout, stderr) {
        expect(stdout.trim()).to.equal('');
        done();
      });
    });

    it('should show no output when using empty regex', function(done) {
      var child = exec('cat file.txt | ' + __dirname + '/../regmatch ""', function(error, stdout, stderr) {
        expect(stdout.trim()).to.equal('');
        done();
      });
    });

    it('should show no output when using empty data', function(done) {
      var child = exec('echo "" | ' + __dirname + '/../regmatch "(\\d+)"', function(error, stdout, stderr) {
        expect(stdout.trim()).to.equal('');
        done();
      });
    });
  });

  describe('capture groups', function() {
    it('should be able to extract a capture group', function(done) {
      var child = exec('cat file.txt | ' + __dirname + '/../regmatch "code: (\\d+)"', function(error, stdout, stderr) {
        expect(stdout.trim()).to.equal('[ [ \'1\' ] ]');
        done();
      });
    });

    it('should be able to extract a capture group in raw mode', function(done) {
      var child = exec('cat file.txt | ' + __dirname + '/../regmatch "code: (\\d+)" --raw', function(error, stdout, stderr) {
        expect(stdout.trim()).to.equal('1');
        done();
      });
    });

    it('should be able to extract two capture groups', function(done) {
      var child = exec('cat file.txt | ' + __dirname + '/../regmatch "code: (\\d+).*guid: (.*-.*-.*-.*)"', function(error, stdout, stderr) {
        expect(stdout.trim()).to.equal('[ [ \'1\', \'a23fc942-575f-4c4e-be2b-423ac4370573\' ] ]');
        done();
      });
    });

    it('should be able to extract two capture groups and only show 1st result if in raw mode', function(done) {
      var child = exec('cat file.txt | ' + __dirname + '/../regmatch ".*guid: (.*-.*-.*-.*)" --raw', function(error, stdout, stderr) {
        expect(stdout.trim()).to.equal('a23fc942-575f-4c4e-be2b-423ac4370573');
        done();
      });
    });
  });

  describe('formats', function() {
    it('should be able to format two capture group results using a space', function(done) {
      var child = exec('cat data.txt | ' + __dirname + '/../regmatch "a=(.*?),.*c=(.*)" --raw --format \'$0 $1\'', function(error, stdout, stderr) {
        expect(stdout.trim()).to.equal('0 5');
        done();
      });
    });

    it('should be able to format two capture group results using a tab', function(done) {
      var child = exec('cat data.txt | ' + __dirname + '/../regmatch "a=(.*?),.*c=(.*)" --raw --format \'$0\t$1\'', function(error, stdout, stderr) {
        expect(stdout.trim()).to.equal('0\t5');
        done();
      });
    });
  });

  describe('modifiers', function() {
    it('should perform a global search with a \'g\' modifier', function(done) {
      var child = exec('cat data.txt | ' + __dirname + '/../regmatch "a=(.*?),.*c=(.*)" --raw --format \'$0\t$1\' --modifiers \'g\'', function(error, stdout, stderr) {
        expect(stdout.trim()).to.equal('0\t5\n2\t4\n3\t7');
        done();
      });
    });

    it('should perform a case-insensitive global search with the \'g\' and \'i\' modifiers', function(done) {
      var child = exec('echo "Age=5\nage=6" | ' + __dirname + '/../regmatch "age=(\\d+)" --raw --format \'$0\' --modifiers \'ig\'', function(error, stdout, stderr) {
        expect(stdout.trim()).to.equal('5\n6');
        done();
      });
    });
  });

  describe('long option/argument order compatibility - all the arguments ordered below should have the same output', function() {
    var output = "1 a23fc942-575f-4c4e-be2b-423ac4370573\n2 5935fe66-fe29-4175-96f7-ce51f1b0b594\n3 4e0a4daa-26c2-4b2b-97f9-583effe1a18c";

    it('cat file.txt | regmatch "code: (\\d+).*guid: (.*-.*-.*-.*)" "g" \'$0 $1\'', function(done) {
      var child = exec('cat file.txt | ' + __dirname + '/../regmatch "code: (\\d+).*guid: (.*-.*-.*-.*)" "g" \'$0 $1\'', function(error, stdout, stderr) {
        expect(stdout.trim()).to.equal(output);
        done();
      });
    });

    it('cat file.txt | regmatch "code: (\\d+).*guid: (.*-.*-.*-.*)" --modifiers "g" --format \'$0 $1\'', function(done) {
      var child = exec('cat file.txt | ' + __dirname + '/../regmatch "code: (\\d+).*guid: (.*-.*-.*-.*)" --modifiers "g" --format \'$0 $1\'', function(error, stdout, stderr) {
        expect(stdout.trim()).to.equal(output);
        done();
      });
    });

    it('cat file.txt | regmatch --modifiers g --format \'$0 $1\' "code: (\\d+).*guid: (.*-.*-.*-.*)"', function(done) {
      var child = exec('cat file.txt | ' + __dirname + '/../regmatch --modifiers g --format \'$0 $1\' "code: (\\d+).*guid: (.*-.*-.*-.*)"', function(error, stdout, stderr) {
        expect(stdout.trim()).to.equal(output);
        done();
      });
    });

    it('cat file.txt | regmatch --format \'$0 $1\' "code: (\\d+).*guid: (.*-.*-.*-.*)" "g"', function(done) {
      var child = exec('cat file.txt | ' + __dirname + '/../regmatch --format \'$0 $1\' "code: (\\d+).*guid: (.*-.*-.*-.*)" "g"', function(error, stdout, stderr) {
        expect(stdout.trim()).to.equal(output);
        done();
      });
    });
  });

  describe('output formats', function() {
    var output = [["1","a23fc942-575f-4c4e-be2b-423ac4370573"],["2","5935fe66-fe29-4175-96f7-ce51f1b0b594"],["3","4e0a4daa-26c2-4b2b-97f9-583effe1a18c"]];
    it('should output json', function(done) {
      var child = exec('cat file.txt | ' + __dirname + '/../regmatch --format \'$0 $1\' "code: (\\d+).*guid: (.*-.*-.*-.*)" "g" --json', function(error, stdout, stderr) {
        expect(stdout.trim()).to.equal(JSON.stringify(output));
        done();
      });
    });
  });
});
