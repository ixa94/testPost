import React, { useState, useEffect, useRef } from 'react';

interface Post {
  id: number;
  title: string;
  body: string;
}

const InfiniteScroll: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMoreData = async () => {
    try {
      setIsLoading(true);
      const nextPage = currentPage + 1;
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_limit=${itemsPerPage}&_page=${nextPage}`
      );
      const data = await response.json();
      if (data.length === 0) {
        setHasMoreData(false);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...data]);
        setCurrentPage(nextPage);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching more data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const handleObserver: IntersectionObserverCallback = (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        fetchMoreData();
      }
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [fetchMoreData]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_limit=${itemsPerPage}`
      );
      const data = await response.json();
      setPosts(data);
      setCurrentPage(1);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseInt(event.target.value, 10);
    setItemsPerPage(inputValue);
  };

  return (
    <div>
      <h1>Infinite Scroll</h1>
      <input type="number" value={itemsPerPage} onChange={handleInputChange} />
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
      {isLoading && <p>Loading...</p>}
      {!isLoading && hasMoreData && <div ref={loaderRef}>Load more</div>}
      {!isLoading && !hasMoreData && <p>No more data to load</p>}
    </div>
  );
};

export default InfiniteScroll;
