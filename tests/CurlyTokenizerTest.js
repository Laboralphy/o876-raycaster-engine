const CurlyTokenizer = require('../libs/curly-tokenizer').default;

describe('CurlyTokenizer', function () {
  it('basic', function () {
    const ct = new CurlyTokenizer();
    ct.parse('toto');
    expect(ct._parsed).toEqual([{tokens: [], text: 'toto'}]);
  })

  it('one curl', function () {
    const ct = new CurlyTokenizer();
    ct.parse('ecrire {c11 utilisation du rouge}');
    expect(ct._parsed).toEqual([{tokens: [], text: 'ecrire '}, {tokens: ['c11'], text: 'utilisation du rouge'}]);
  })

  it('more curls', function () {
    const ct = new CurlyTokenizer();
    ct.parse('ecrire {c1 utilisation du rouge et {b du gras}} {c2 youy}');
    expect(ct._parsed).toEqual([
      { tokens: [], text: 'ecrire ' },
      { tokens: [ 'c1' ], text: 'utilisation du rouge et ' },
      { tokens: [ 'c1', 'b' ], text: 'du gras' },
      { tokens: [], text: ' ' },
      { tokens: [ 'c2' ], text: 'youy' }
    ]);
  })

  it('escape chars', function () {
    const ct = new CurlyTokenizer();
    ct.parse('ecrire \\{c1 utilisation du rouge et {b du gras}\\}');
    expect(ct._parsed).toEqual([
      { tokens: [], text: 'ecrire {c1 utilisation du rouge et ' },
      { tokens: [ 'b' ], text: 'du gras' },
      { tokens: [], text: '}' }
    ]);
  })

  it('multi curly', function () {
    const ct = new CurlyTokenizer();
    ct.parse('{purple {b xxxx xxxx}} blabla');
    expect(ct._parsed).toEqual([
      { tokens: ['purple', 'b'], text: 'xxxx xxxx' },
      { tokens: [], text: ' blabla' }
    ]);
  })

  it('signle tag', function () {
    const ct = new CurlyTokenizer();
    ct.parse('xxx{br}');
    expect(ct._parsed).toEqual([
      { tokens: [], text: 'xxx' },
      { tokens: ['br'], text: '' }
    ]);
  })
})
