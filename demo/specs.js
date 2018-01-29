describe('demo suite', () => {
  xit('spec skip', () => {});

  it('spec success', () => {
    expect(true).toEqual(true);
  });

  it('spec fail', () => {
    expect(true).toEqual(false);
  });

  xdescribe('skipped suite', () => {
    xit('spec skip', () => {});

    it('spec success', () => {
      expect(true).toEqual(true);
    });

    it('spec fail', () => {
      expect(true).toEqual(false);
    });
  });

  describe('inner suite', () => {
    it('spec skip', () => {
      pending();
    });

    it('spec success', () => {
      expect(true).toEqual(true);
    });

    it('spec fail', () => {
      expect(true).toEqual(false);
    });
  });
});
