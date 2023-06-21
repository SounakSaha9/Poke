import React, { useState } from "react";
import PropTypes from "prop-types";
import Bookmarks from "./Bookmarks";

function BigCardButton({ name }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkedCards, setBookmarkedCards] = useState([]);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (isBookmarked) {
      // Card is already bookmarked, remove it
      setBookmarkedCards(bookmarkedCards.filter((card) => card.name !== name));
    } else {
      // Card is not bookmarked, add it
      setBookmarkedCards([...bookmarkedCards, { id: name, name }]);
    }
  };

  return (
    <div className="h-min mt-2 xl:mt-8">
      <button
        onClick={handleBookmark}
        className={`capitalize rounded-3xl p-2 text-base xl:text-lg bg-purpleTheme text-yellowTheme shadow-2xl cursor-pointer hover:bg-purple-900 xl:w-full ${
          isBookmarked ? "bg-yellowTheme text-purpleTheme" : ""
        }`}
        style={{ width: "200px", height: "50px" }}
      >
        <span style={{ fontSize: "18px" }}>
          {isBookmarked ? "Bookmarked" : "Bookmark"}
        </span>
      </button>
      <Bookmarks bookmarkedCards={bookmarkedCards} />
    </div>
  );
}

BigCardButton.propTypes = {
  name: PropTypes.string.isRequired,
};

export default BigCardButton;