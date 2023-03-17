import Automaton from '../automaton';
import ArrayHelper from '../array-helper';

class CurlyTokenizer {
  constructor () {
    this._text = '';
    this._index = 0;
    this._subtext = '';
    this._tokens = [];
    this._parsed = [];
    this._end = false;
    this._automaton = new Automaton();
    this._automaton.transitions = {
      init: [
        ['isEscape', 'incIndex', 'parseText'],
        ['isCurlOpen', 'incIndex', 'parseCommand'],
        ['isCurlClose', 'incIndex', 'pushText', 'popToken', 'init'],
        ['isEndOfText', 'end'],
        [1, 'parseText']
      ],
      parseText: [
        ['isEscape', 'incIndex', 'parseText'],
        ['isCurlOpen', 'pushText', 'incIndex', 'parseCommand'],
        ['isCurlClose', 'incIndex', 'pushText', 'popToken', 'init'],
        ['isEndOfText', 'pushText', 'end']
      ],
      parseCommand: [
        ['isEscape', 'incIndex', 'parseCommand'],
        ['isSpace', 'pushToken', 'parseSeparator'],
        ['isCurlClose', 'incIndex', 'pushToken', 'pushEmptyText', 'popToken', 'init'],
        ['isEndOfText', 'end']
      ],
      parseSeparator: [
        ['isEscape', 'incIndex', 'parseText'],
        ['isCurlOpen', 'incIndex', 'parseCommand'],
        ['isNotSpace', 'parseText'],
        ['isCurlClose', 'incIndex', 'init'],
        ['isEndOfText', 'end']
      ]
    };
    this._automaton.instance = this;
  }

  getCurrentChar () {
    return this._text.charAt(this._index);
  }

  reset () {
    this._text = '';
    this._index = 0;
    this._subtext = '';
    this._tokens = [];
    this._parsed = [];
    this._end = false;
  }

  parse (sInput) {
    this.reset();
    this._text = sInput;
    this._automaton.state = 'init';
    let i = 0;
    while (i < 16384 && !this._end) {
      this._automaton.process();
      ++i;
    }
    return this._parsed;
  }

  isCurlOpen () {
    return this.getCurrentChar() === '{';
  }

  isCurlClose () {
    return this.getCurrentChar() === '}';
  }

  isSpace () {
    return this.getCurrentChar() === ' ';
  }

  isNotSpace () {
    return !this.isSpace();
  }

  isEndOfText () {
    return this._index >= this._text.length;
  }

  isEscape () {
    return this.getCurrentChar() === '\\';
  }

  /**
   * Etat de lecture d'un texte normal
   */
  init () {
    this._end = false;
  }

  parseText () {
    this._subtext += this.getCurrentChar();
    this.incIndex();
  }

  parseCommand () {
    this.parseText();
  }

  parseSeparator () {
    this.incIndex();
  }

  incIndex () {
    ++this._index;
  }

  pushText () {
    if (this._subtext !== '') {
      this._parsed.push({
        tokens: ArrayHelper.uniq(this._tokens),
        text: this._subtext
      });
      this._subtext = '';
    }
  }

  pushEmptyText () {
    this._parsed.push({
      tokens: ArrayHelper.uniq(this._tokens),
      text: ''
    });
    this._subtext = '';
  }

  pushToken () {
    this._tokens.push(this._subtext);
    this._subtext = '';
  }

  popToken () {
    this._tokens.pop();
  }

  end () {
    this._end = true;
  }
}

export default CurlyTokenizer;
