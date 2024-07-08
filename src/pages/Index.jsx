import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StockModule from "@/components/StockModule";
import CryptoModule from "@/components/CryptoModule";

const fetchTopStories = async () => {
  const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
  const storyIds = await response.json();
  return storyIds.slice(0, 100);
};

const fetchStory = async (id) => {
  const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
  return await response.json();
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stories, setStories] = useState([]);

  const { data: storyIds, isLoading: isLoadingIds, error: idsError } = useQuery({
    queryKey: ["topStories"],
    queryFn: fetchTopStories,
  });

  useEffect(() => {
    if (storyIds) {
      const fetchAllStories = async () => {
        const storyPromises = storyIds.map(fetchStory);
        const fetchedStories = await Promise.all(storyPromises);
        setStories(fetchedStories);
      };
      fetchAllStories();
    }
  }, [storyIds]);

  const filteredStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (idsError) return <div>Error fetching stories</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Emir Kaan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <Input
            type="text"
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-6"
          />
          {isLoadingIds ? (
            <div className="space-y-4">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-4">
              {filteredStories.map((story) => (
                <li key={story.id} className="border p-4 rounded-md">
                  <h2 className="text-xl font-semibold text-red-600">{story.title}</h2>
                  <p className="text-sm text-gray-500">Upvotes: {story.score}</p>
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => window.open(story.url, "_blank")}
                  >
                    Read more
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="space-y-6">
          <StockModule />
          <CryptoModule />
        </div>
      </div>
    </div>
  );
};

export default Index;