import Report from '../../src/report';

function assembleTestReport(): Report {
  return {
    author: 'Max',
    authoredAt: new Date(),
    fetchedAt: new Date(),
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    platformID: 'abcdef',
    content: 'Foo bar',
    raw: {},
  };
}

export default assembleTestReport;
