describe('demo suite', function() {
  xit('spec skip', function() {});

  it('spec success', function() {
    expect(true).toEqual(true);
  });

  it('spec fail', function() {
    expect(true).toEqual(false);
  });

  describe('inner suite', function() {
    it('spec skip', function() {
      pending()
    });

    it('spec success', function() {
      expect(true).toEqual(true);
    });

    it('spec fail', function() {
      expect(true).toEqual(false);
    });
  });

  xdescribe('skipped suite', function() {
    xit('spec skip', function() {});

    it('spec success', function() {
      expect(true).toEqual(true);
    });

    it('spec fail', function() {
      expect(true).toEqual(false);
    });
  });
});
