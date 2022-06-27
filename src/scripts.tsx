import React, { useEffect, useState } from "react";
import { render } from "react-dom";

interface Data {
  title: string;
  description: string;
  length: string;
  lists: Section[];
}

interface Section {
  id: string;
  title: string;
  items: Game[];
}

interface Game {
  id: number;
  title: string;
  provider: string;
  image: string;
}

export default function App() {
  const dataJson = "../api/games/lists.json";
  const [data, setData] = useState<undefined | Data>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [search, setSearch]: [
    string,
    (search: string) => void
  ] = useState<string>(String);

  useEffect(() => {
    setLoading(true);
    fetch(`${dataJson}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Data is loading...</p>;
  }

  if (error || !data) {
    return <p> There was a Error loading the data!</p>;
  }

  function filterByString(game: Game) {
    const parsedSearch = search.toLowerCase();
    const parsedGameTitle = game.title.toLowerCase();

    const searchLetters = parsedSearch.split("");
    const gameTitleLetters = parsedGameTitle.split("");

    const noSearch = parsedSearch === "";
    const hasMatch = parsedSearch === parsedGameTitle;

    const hasLetter = searchLetters.every((gameItem) =>
      gameTitleLetters.includes(gameItem)
    );

    return noSearch || hasMatch || hasLetter;
  }

  console.log(data);
  return (
    <>
      <div className="wrapper">
        <h1>{data.title}</h1>

        {/* This is the search input */}
        <ul id="growing-search-ul">
          <li>
            <div className="growing-search">
              <div className="input">
                <input
                  type="text"
                  placeholder="Sök Spel"
                  onChange={(event) => setSearch(event.target.value)}
                  name="search"
                />
              </div>
              <div className="submit">
                <button type="submit" name="go_search">
                  <span className="fa fa-search"></span>
                </button>
              </div>
            </div>
          </li>
        </ul>

        <hr className="dash-breaker" />
        <p className="description-p">{data.description}</p>
        {data.lists.map((section) => {
          return (
            <div key={section.id}>
              {/* This is the section */}
              <h3>{section.title}</h3>
              <div className="map-row">
                <div className="map-wrapper" key={section.id}>
                  {section.items.filter(filterByString).map((game) => (
                    <div key={game.id}>
                      {/* This is the items */}
                      <figure className="img-wrapper">
                        <img className="item-img" src={game.image} />
                        <figcaption className="text">{game.title}</figcaption>
                      </figure>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

render(<App />, document.getElementById("root"));
