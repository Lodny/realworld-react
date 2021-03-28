import * as React from 'react';
import axios from 'axios';
import { FeedContext } from '../store/feedStore';

const Editor = ({ match, history }) => {
  const { store } = React.useContext(FeedContext);
  const [article, setArticle] = React.useState({ tagList: [] }); //Object.assign({}, store.user));
  // const { title, description, body, tag, tagList } = article;
  const title = React.useRef();

  React.useEffect(() => {
    console.log('Editor() : useEffect() : match.params : ', match.params);
    if (match?.params.slug) {
      const processSuccess = (data) => {
        console.log('Editor() : useEffect() : processSuccess() : ', data.article);
        setArticle(data.article);
      };

      const processError = (err) => {
        console.log('Editor() : useEffect() : processError() : ', err);
        if (err?.status) {
          console.log('status', err.status, err.data);
        }
      };

      // const url = `https://conduit.productionready.io/api/articles/${match.params.slug}`;
      const url = `${store.serverBase()}/api/articles/${match.params.slug}`;
      axios
        .get(url)
        .then((res) => processSuccess(res.data))
        .catch((err) => processError(err?.response || err?.request || err.message));
    }

    title.current.focus();
    title.current.select();
  }, []);

  const handleInput = (input) => (e) => {
    // console.log('Editor() : handleInput() : ', input, e.target.value);
    setArticle(Object.assign({}, article, { [input]: e.target.value }));
  };

  // const [title, setTitle] = React.useState();
  // const [description, setDescription] = React.useState();
  // const [body, setBody] = React.useState();
  // const [tag, setTag] = React.useState();
  // const [tagList, setTagList] = React.useState([]);

  // const handleInput = (input) => (e) => {
  //   switch (input) {
  //     case 'title':
  //       setTitle(e.target.value);
  //       break;
  //     case 'description':
  //       setDescription(e.target.value);
  //       break;
  //     case 'body':
  //       setBody(e.target.value);
  //       break;
  //     case 'tag':
  //       setTag(e.target.value);
  //       break;
  //   }
  // };

  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      setArticle(Object.assign({}, article, { tagList: [...article.tagList, e.target.value], tag: '' }));
      // setTag('');
      // setTagList([...tagList, e.target.value]);
    }
  };

  const handleDeleteTag = (delTag) => () => {
    // setTagList(tagList.filter((tag) => tag !== delTag));
    setArticle(Object.assign({}, article, { tagList: article.tagList.filter((tag) => tag !== delTag) }));
  };

  const addArticle = () => {
    console.log('Editor() : addArticle() : ', article);

    const processSuccess = (data) => {
      console.log('Editor() : addArticle() : processSuccess() : ', data);
      history.push(`/article/${data.article.slug}`);
    };

    const processError = (err) => {
      console.log('Editor() : addArticle() : processError() : ', err);
      if (err?.status) {
        console.log('status', err.status, err.data);
      }
    };

    const url = `${store.serverBase()}/api/articles`;
    console.log('Editor() : addArticle() : url : ', url);
    const body = {
      article: {
        ...article
      }
    };

    if (match?.params.slug) {
      axios
        .put(`${url}/${match.params.slug}`, body, store.tokenHeader(store.user))
        .then((res) => processSuccess(res.data))
        .catch((err) => processError(err?.response || err?.request || err.message));
    } else {
      axios
        .post(url, body, store.tokenHeader(store.user))
        .then((res) => processSuccess(res.data))
        .catch((err) => processError(err?.response || err?.request || err.message));
    }
  };

  return (
    <div className='editor-page'>
      <div className='container page'>
        <div className='row'>
          <div className='col-md-10 offset-md-1 col-xs-12'>
            <form>
              <fieldset>
                <fieldset className='form-group'>
                  <input
                    type='text'
                    className='form-control form-control-lg'
                    placeholder='Article Title'
                    ref={title}
                    value={article.title}
                    onChange={handleInput('title')}
                  />
                </fieldset>
                <fieldset className='form-group'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder="What's this article about?"
                    value={article.description}
                    onChange={handleInput('description')}
                  />
                </fieldset>
                <fieldset className='form-group'>
                  <textarea
                    className='form-control'
                    rows='8'
                    placeholder='Write your article (in markdown)'
                    value={article.body}
                    onChange={handleInput('body')}
                  ></textarea>
                </fieldset>
                <fieldset className='form-group'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Enter tags'
                    value={article.tag}
                    onChange={handleInput('tag')}
                    onKeyUp={handleKeyUp}
                  />
                  <div className='tag-list'></div>
                </fieldset>
                <div className='tag-list'>
                  {article.tagList.map((tag, idx) => (
                    <span className='tag-default tag-pill ng-binding ng-scope' key={idx}>
                      <i className='ion-close-round' onClick={handleDeleteTag(tag)}></i>
                      {tag}
                    </span>
                  ))}
                </div>
                <button className='btn btn-lg pull-xs-right btn-primary' type='button' onClick={addArticle}>
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
