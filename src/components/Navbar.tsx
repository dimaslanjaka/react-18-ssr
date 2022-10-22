import React from 'react';
import { Link } from 'react-router-dom';
import searchData from '../utils/search.json';
//import './Nav.scss'

type SearchDataType = typeof searchData & {
  [key: string]: any;
};

export default function Navbar() {
  const [query, setQuery] = React.useState('');
  const textInput = React.createRef<HTMLInputElement>();
  function search(keyword?: string) {
    if (typeof keyword !== 'string' && textInput.current) {
      keyword = textInput.current.value;
    }
    if (typeof keyword === 'string') {
      setQuery(keyword);
    }
    const filtered: SearchDataType = searchData.filter((item) => {
      if (query.trim().length === 0) return false;
      if (new RegExp('^' + query + '$', 'i').test(item.name)) return true;
      if (new RegExp(query, 'i').test(item.name)) return true;
    });
    return filtered;
  }
  return (
    <div className="navbar-wrapper">
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top py-2">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img
              src="https://www.webmanajemen.com/images/PicsArt_09-09-12.12.25.jpg"
              alt=""
              width="30"
              height="24"
            />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/attendants">
                  Attendants
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/monsters">
                  Monsters
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/materials">
                  Materials
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/recipes/index.html">
                  Recipes
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/scenic-spots" tabIndex={-1}>
                  Scenic Spots
                </Link>
              </li>
            </ul>
            <form id="sbx" className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                ref={textInput}
                //onBlur={(_e) => search('')}
                onFocus={(_e) => search(_e.target.value)}
                onChange={(_e) => search(_e.target.value)}
              />
              {/*<button
                className="btn btn-outline-success"
                type="submit"
                onClick={(_e) => search()}>
                Search
  </button>*/}
              <div className="box-wrapper">
                {search().map((item, index) => {
                  return (
                    <div className="box" key={index}>
                      <Link className="me-2" to={item.pathname}>
                        {item.type}:
                      </Link>
                      <Link to={item.pathname}>{item.name}</Link>
                    </div>
                  );
                })}
              </div>
            </form>
          </div>
        </div>
      </nav>
    </div>
  );
}
