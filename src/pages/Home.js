import { useState, useEffect, useRef } from "react";
import Axios from "axios";
import PropTypes from "prop-types";

import BackgroundImage from "../components/ui/BackgroundImage";
import CardsContainer from "../components/ui/CardComponents/CardsContainer";
import SmallCard from "../components/ui/CardComponents/SmallCard";
import Loader from "../components/ui/Loader";
import Error from "./errors/Error";

function Home({ searchTerm, openBigCard }) {
  const [page, setPage] = useState(1);
  const limit = 100;
  const [pokemonData, setPokemonData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const observer = useRef();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const response = await Axios.get(
          searchTerm
            ? `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`
            : `https://pokeapi.co/api/v2/pokemon?offset=${
                (page - 1) * limit
              }&limit=${limit}`
        );

        const { results } = response.data;

        if (searchTerm) {
          setPokemonData([response.data]);
        } else {
          const requests = results.map((result) => Axios.get(result.url));
          const pokemonResponses = await Promise.all(requests);
          const pokemonData = pokemonResponses.map((pokemonRes) => pokemonRes.data);
          setPokemonData((prevData) => [...prevData, ...pokemonData]);
        }
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [searchTerm, page]);

  function hasHomeSprite(data) {
    return !(data?.id >= 906 && data?.id <= 1008);
  }

  function isPokemonAvailable(data) {
    return !(data?.id >= 1009);
  }

  const getHomeSprite = (data) =>
    data?.sprites.other.home.front_default;

  const getArtworkSprite = (data) =>
    data?.sprites.other["official-artwork"]["front_default"];

  function observeLastCardElement(node) {
    if (node) {
      observer.current = new IntersectionObserver((entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      observer.current.observe(node);
    }
  }

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <BackgroundImage>
        <Loader></Loader>
      </BackgroundImage>
    );
  }

  if (isError) {
    return (
      <BackgroundImage>
        <Error />
      </BackgroundImage>
    );
  }

  if (searchTerm) {
    const pokemon = pokemonData[0];

    if (!isPokemonAvailable(pokemon)) {
      return (
        <BackgroundImage>
          <Error />
        </BackgroundImage>
      );
    }

    const imageValue = hasHomeSprite(pokemon)
      ? getHomeSprite(pokemon)
      : getArtworkSprite(pokemon);

    return (
      <BackgroundImage>
        <CardsContainer>
          <SmallCard
            height={pokemon.height}
            id={pokemon.id}
            image={imageValue}
            name={pokemon.species.name}
            weight={pokemon.weight}
            openBigCard={openBigCard}
          />
        </CardsContainer>
      </BackgroundImage>
    );
  }

  return (
    <BackgroundImage>
      <CardsContainer>
        {pokemonData.map((pokemon, index) => {
          const isLastCard = index === pokemonData.length - 1;
          let imageValue;

          if (!isPokemonAvailable(pokemon)) {
            return null;
          }

          if (hasHomeSprite(pokemon)) {
            imageValue = getHomeSprite(pokemon);
          } else {
            imageValue = getArtworkSprite(pokemon);
          }

          return (
            <div
              key={pokemon.id}
              ref={isLastCard ? observeLastCardElement : null}
            >
              <SmallCard
                height={pokemon.height}
                id={pokemon.id}
                image={imageValue}
                name={pokemon.species.name}
                weight={pokemon.weight}
                openBigCard={openBigCard}
              />
            </div>
          );
        })}
      </CardsContainer>
    </BackgroundImage>
  );
}

Home.propTypes = {
  searchTerm: PropTypes.string,
  openBigCard: PropTypes.func,
};

export default Home;