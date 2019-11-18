import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';
import { first } from 'lodash';
import Media from 'react-responsive';
import { Modal } from '@freecodecamp/react-bootstrap';

import LearnLayout from '../../../components/layouts/Learn';
import Editor from './Editor';
import Preview from '../components/Preview';
import SidePanel from '../components/Side-Panel';
import Output from '../components/Output';
import MobileLayout from './MobileLayout';
import DesktopLayout from './DesktopLayout';
import Hotkeys from '../components/Hotkeys';

import { getGuideUrl } from '../utils';
import { challengeTypes } from '../../../../utils/challengeTypes';
import { ChallengeNode } from '../../../redux/propTypes';
import { dasherize } from '../../../../utils';
import {
  createFiles,
  challengeFilesSelector,
  challengeTestsSelector,
  initConsole,
  initTests,
  updateChallengeMeta,
  challengeMounted,
  consoleOutputSelector,
  executeChallenge
} from '../redux';

import './classic.css';
import '../components/test-frame.css';

const mapStateToProps = createStructuredSelector({
  files: challengeFilesSelector,
  tests: challengeTestsSelector,
  output: consoleOutputSelector
});

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators(
      {
        createFiles,
        initConsole,
        initTests,
        updateChallengeMeta,
        challengeMounted,
        executeChallenge
      },
      dispatch
    )
  };
};

const propTypes = {
  challengeMounted: PropTypes.func.isRequired,
  createFiles: PropTypes.func.isRequired,
  data: PropTypes.shape({
    challengeNode: ChallengeNode
  }),
  executeChallenge: PropTypes.func.isRequired,
  files: PropTypes.shape({
    key: PropTypes.string
  }),
  initConsole: PropTypes.func.isRequired,
  initTests: PropTypes.func.isRequired,
  output: PropTypes.string,
  pageContext: PropTypes.shape({
    challengeMeta: PropTypes.shape({
      id: PropTypes.string,
      introPath: PropTypes.string,
      nextChallengePath: PropTypes.string,
      prevChallengePath: PropTypes.string
    })
  }),
  tests: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      testString: PropTypes.string
    })
  ),
  updateChallengeMeta: PropTypes.func.isRequired
};

const MAX_MOBILE_WIDTH = 767;

class ShowClassic extends Component {
  constructor() {
    super();

    this.resizeProps = {
      onStopResize: this.onStopResize.bind(this),
      onResize: this.onResize.bind(this)
    };

    this.state = {
      showQuestion: false,
      resizing: false,
      questionData: {
        title: 'Headline with the h2 Element',
        description: 'This is Question description',
        instructions: [
          '1.Write a <code>div</code> element in the body.',
          '2. In <code>div</code> element write an <code>img</code> element with src attribute value "https://drive.google.com/open?id=1FcfljeJtHeGpcRMjpa8RbPR2jnXIXMUU" and alt attribute value "HTML logo".', //eslint-disable-line
          '3. Insert <code>h2</code> element and write "HTML" text as heading after <code>img</code> element.', //eslint-disable-line
          '4. Insert <code>p</code> element and write "Hyper Text Markup Language (HTML) is a markup language for creating a webpage" text as paragraph.' //eslint-disable-line
        ],
        challengeType: 0,
        videoUrl: '',
        forumTopicId: 18196,
        fields: {
          slug: 'SSD',
          blockName: 'Challenge',
          tests: [
            {
              text: 'Should have <code>img</code> element..',
              testString: 'assert(($("img").length > 0));'
            },
            {
              text: 'Should have <code>h2</code> element..',
              testString: 'assert(($("h2").length > 0));'
            }
          ]
        }
      },
      setInitialCode: false
    };

    this.containerRef = React.createRef();
  }

  toggleShowQuestion = () => {
    this.setState(prevState => ({
      showQuestion: !prevState.showQuestion
    }));
  };
  onResize() {
    this.setState({ resizing: true });
  }

  onStopResize() {
    this.setState({ resizing: false });
  }

  _onMessage = data => {
    this.setState(
      {
        questionData: data.questionData
      },
      () => {
        this.initializeComponent();
      }
    );
  };

  componentDidMount() {
    window.WebViewBridge = {
      onMessage: this._onMessage
    };
    const event = new Event('WebViewBridge');
    window.dispatchEvent(event);
    // alert('In React');

    try {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'INIT' }));
    } catch (error) {
      console.log('React native webview error', error);
    }
  }

  // componentDidUpdate(prevProps) {
  //   const {
  //     data: {
  //       challengeNode: { title: prevTitle }
  //     }
  //   } = prevProps;
  //   const {
  //     data: {
  //       challengeNode: { title: currentTitle }
  //     }
  //   } = this.props;
  //   if (prevTitle !== currentTitle) {
  //     this.initializeComponent(currentTitle);
  //   }
  // }

  initializeComponent() {
    const {
      challengeMounted,
      createFiles,
      initConsole,
      initTests,
      updateChallengeMeta,
      data: {
        challengeNode: { files, challengeType }
      },
      pageContext: { challengeMeta }
    } = this.props;
    const {
      title,
      fields: { tests }
    } = this.state.questionData;
    initConsole('');
    createFiles(files);
    initTests(tests);
    updateChallengeMeta({ ...challengeMeta, title, challengeType });
    challengeMounted(challengeMeta.id);
  }

  componentWillUnmount() {
    const { createFiles } = this.props;
    createFiles({});
  }

  getChallenge = () => this.state.questionData;

  getBlockNameTitle() {
    const {
      fields: { blockName },
      title
    } = this.getChallenge();
    return `${blockName}: ${title}`;
  }

  getVideoUrl = () => this.getChallenge().videoUrl;

  getChallengeFile() {
    const { files } = this.props;
    console.log('files ', files);
    return first(Object.keys(files).map(key => files[key]));
  }

  hasPreview() {
    const { challengeType } = this.getChallenge();
    return (
      challengeType === challengeTypes.html ||
      challengeType === challengeTypes.modern
    );
  }

  renderInstructionsPanel() {
    const {
      fields: { blockName },
      description,
      instructions
    } = this.getChallenge();

    const { forumTopicId, title } = this.getChallenge();
    return (
      <Modal
        animation={false}
        bsSize='lg'
        dialogClassName='challenge-success-modal'
        keyboard={true}
        onHide={this.toggleShowQuestion}
        onKeyDown={false}
        show={this.state.showQuestion}
      >
        <Modal.Header
          className='challenge-list-header fcc-modal'
          closeButton={true}
        />
        <SidePanel
          className='full-height'
          description={description}
          guideUrl={getGuideUrl({ forumTopicId, title })}
          instructions={instructions}
          section={dasherize(blockName)}
          showToolPanel={false}
          title={this.getBlockNameTitle()}
          videoUrl={this.getVideoUrl()}
        />
      </Modal>
    );
  }

  renderEditor() {
    const { files } = this.props;

    const challengeFile = first(Object.keys(files).map(key => files[key]));
    // if (challengeFile && !this.state.setInitialCode) {
    //   challengeFile.contents = '<h3>This is H3</h3>';
    //   this.setState({
    //     setInitialCode: true
    //   });
    // }
    return (
      challengeFile && (
        <Editor
          containerRef={this.containerRef}
          {...challengeFile}
          fileKey={challengeFile.key}
        />
      )
    );
  }

  renderTestOutput() {
    const { output } = this.props;
    return (
      <Output
        defaultOutput={`
/**
* Your test output will go here.
*/
`}
        output={output}
      />
    );
  }

  renderPreview() {
    return (
      <Preview className='full-height' disableIframe={this.state.resizing} />
    );
  }

  getCode = () => {
    const file = this.getChallengeFile();
    window.ReactNativeWebView.postMessage(
      JSON.stringify({ code: file.contents })
    );
  };

  render() {
    if (!this.state.questionData) {
      return <div>Loading</div>;
    }
    const { forumTopicId, title } = this.getChallenge();
    const {
      executeChallenge,
      pageContext: {
        challengeMeta: { introPath, nextChallengePath, prevChallengePath }
      }
    } = this.props;
    return (
      <Hotkeys
        executeChallenge={executeChallenge}
        innerRef={this.containerRef}
        introPath={introPath}
        nextChallengePath={nextChallengePath}
        prevChallengePath={prevChallengePath}
      >
        <LearnLayout>
          <Helmet
            title={`Learn ${this.getBlockNameTitle()} | freeCodeCamp.org`}
          />
          <div id='header-container'>
            <div id='show-question' onClick={this.toggleShowQuestion}>
              Show Question
            </div>
            <div id='run-tests' onClick={executeChallenge}>
              Run Tests
            </div>
          </div>
          {this.renderInstructionsPanel()}
          <Media maxWidth={MAX_MOBILE_WIDTH}>
            <MobileLayout
              editor={this.renderEditor()}
              guideUrl={getGuideUrl({ forumTopicId, title })}
              hasPreview={this.hasPreview()}
              instructions={this.renderInstructionsPanel({
                showToolPanel: false
              })}
              preview={this.renderPreview()}
              testOutput={this.renderTestOutput()}
              videoUrl={this.getVideoUrl()}
            />
          </Media>
          <Media minWidth={MAX_MOBILE_WIDTH + 1}>
            <DesktopLayout
              challengeFile={this.getChallengeFile()}
              editor={this.renderEditor()}
              hasPreview={this.hasPreview()}
              instructions={this.renderInstructionsPanel({
                showToolPanel: true
              })}
              preview={this.renderPreview()}
              resizeProps={this.resizeProps}
              testOutput={this.renderTestOutput()}
            />
          </Media>
        </LearnLayout>
      </Hotkeys>
    );
  }
}

ShowClassic.displayName = 'ShowClassic';
ShowClassic.propTypes = propTypes;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowClassic);

export const query = graphql`
  query ClassicChallenge($slug: String!) {
    challengeNode(fields: { slug: { eq: $slug } }) {
      title
      description
      instructions
      challengeType
      videoUrl
      forumTopicId
      fields {
        slug
        blockName
        tests {
          text
          testString
        }
      }
      required {
        link
        src
      }
      files {
        indexhtml {
          key
          ext
          name
          contents
          head
          tail
        }
        indexjs {
          key
          ext
          name
          contents
          head
          tail
        }
        indexjsx {
          key
          ext
          name
          contents
          head
          tail
        }
      }
    }
  }
`;
