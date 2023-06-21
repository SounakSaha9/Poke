import React from "react";
import PropTypes from "prop-types";

function Bookmarks({ bookmarkedCards }) {
  return (
    <div>
      <button className="capitalize rounded-3xl px-4 py-2 text-base xl:text-lg bg-purpleTheme text-yellowTheme shadow-2xl cursor-pointer hover:bg-purple-900 mt-3">
        Bookmarked Cards
      </button>
      {bookmarkedCards.map((card) => (
        <div key={card.id}>{card.name}</div>
      ))}
    </div>
  );
}

Bookmarks.propTypes = {
  bookmarkedCards: PropTypes.array.isRequired,
};

export default Bookmarks;