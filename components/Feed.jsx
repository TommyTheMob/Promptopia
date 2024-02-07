'use client'

import {useState, useEffect} from 'react';

import PromptCard from "@/components/PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
    return (
        <div className='mt-16 prompt_layout'>
            {data
                .map((post) => (
                <PromptCard
                    key={post._id}
                    post={post}
                    handleTagClick={handleTagClick}
                />
            ))}
        </div>
    )
}

const Feed = () => {
    const [posts, setPosts] = useState([])

    const [searchText, setSearchText] = useState('')
    const [searchTimeOut, setSearchTimeOut] = useState(null)
    const [searchedResults, setSearchedResults] = useState([])

    const filteringPosts = (searchText) => {
        const regex = new RegExp(searchText, 'i')

        return posts.filter(p =>
            regex.test(p.creator.username) ||
            regex.test(p.prompt) ||
            regex.test(p.tag)
        )
    }

    const handleSearchChange = (e) => {
        clearTimeout(searchTimeOut)
        setSearchText(e.target.value)

        setSearchTimeOut(() => {
            setTimeout(() => {
                const filteredPosts = filteringPosts(e.target.value)
                setSearchedResults(filteredPosts)
            }, 500)
        })
    }

    const handleTagClick = (tag) => {
        setSearchText(tag)

        const filteredPosts = filteringPosts(tag)
        setSearchedResults(filteredPosts)
    }

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch('/api/prompt', {next: {revalidate: 10}})
            const data = await response.json()

            setPosts(data)
        }

        fetchPosts()
    }, []);

    return (
        <section className='feed'>
            <form className='relative w-full flex-center'>
                <input
                    type="text"
                    placeholder='Search for a tag or a username'
                    value={searchText}
                    onChange={handleSearchChange}
                    required
                    className='search_input peer'
                />
            </form>

            <PromptCardList
                data={searchText ? searchedResults : posts}
                searchText={searchText}
                handleTagClick={handleTagClick}
            />
        </section>
    );
};

export default Feed;