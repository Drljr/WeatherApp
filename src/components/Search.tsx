import React, { useRef } from 'react';

interface SearchProps {
    onSearch: (city: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(event.target.value);
    };

    const handleSearchButtonClick = () => {
        if (inputRef.current) {
            onSearch(inputRef.current.value);
        }
    };

    return (
        <div>
            <input type="text" placeholder="Enter city name" onChange={handleInputChange} ref={inputRef} />
            <button onClick={handleSearchButtonClick}>Search</button>
        </div>
    );
};

export default Search;