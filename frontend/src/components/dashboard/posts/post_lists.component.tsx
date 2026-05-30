import React, { useState, useMemo } from "react";
import { useGetPostListsQuery } from "../../../redux/apis/post.api";
import { useDebounced } from "../../../hooks/global";
import { Post, Topic } from "../../../models/post";
import PaginationComponent from "../../pagination/pagination.component";

interface FilterStats {
  total: number;
  published: number;
  drafts: number;
  featured: number;
}

const PostListsComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [size, setSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft" | "featured">("all");
  
  const query: Record<string, string | number> = {
    page,
    limit: size,
  };

  const debounceTerm = useDebounced({
    searchQuery: searchTerm,
    daley: 600,
  });

  if (debounceTerm) {
    query["searchTerm"] = debounceTerm;
  }

  // const { data, isLoading } = useGetPostListsQuery({ ...query });
  const isLoading = false;
  const data = {
    meta: { total: 3 },
    posts: [
      {
        _id: "1",
        title: "Understanding React Hooks Deep Dive",
        tag: "React",
        author: { name: "Lisa Wang", email: "lisa@example.com" },
        topic: [{ _id: "t1", title: "Technology", color: "#3b82f6" }, { _id: "t3", title: "Web", color: "#10b981" }],
        isPublished: true,
        isFeaturedPost: true,
        likesCount: 1205,
        commentsCount: 342,
        viewsCount: 15400,
        createdAt: "2023-10-01T12:00:00Z",
        imageURL: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=200&fit=crop"
      },
      {
        _id: "2",
        title: "Mastering Tailwind CSS for Dark Themes",
        tag: "CSS",
        author: { name: "Aditya Gautam", email: "aditya@example.com" },
        topic: [{ _id: "t2", title: "Design", color: "#ec4899" }],
        isPublished: false,
        isFeaturedPost: false,
        likesCount: 89,
        commentsCount: 12,
        viewsCount: 1205,
        createdAt: "2023-10-02T12:00:00Z",
        imageURL: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=200&h=200&fit=crop"
      },
      {
        _id: "3",
        title: "Building Scalable AI Applications",
        tag: "AI/ML",
        author: { name: "John Smith", email: "john@example.com" },
        topic: [{ _id: "t4", title: "AI", color: "#8b5cf6" }, { _id: "t1", title: "Technology", color: "#3b82f6" }],
        isPublished: true,
        isFeaturedPost: false,
        likesCount: 890,
        commentsCount: 156,
        viewsCount: 9800,
        createdAt: "2023-10-05T09:30:00Z",
        imageURL: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=200&fit=crop"
      }
    ]
  };

  // Calculate filter stats
  const filterStats: FilterStats = useMemo(() => {
    return {
      total: data?.posts?.length || 0,
      published: data?.posts?.filter((p: Post) => p.isPublished)?.length || 0,
      drafts: data?.posts?.filter((p: Post) => !p.isPublished)?.length || 0,
      featured: data?.posts?.filter((p: Post) => p.isFeaturedPost)?.length || 0,
    };
  }, [data?.posts]);

  // Filter posts based on status
  const filteredPosts = useMemo(() => {
    let filtered = data?.posts || [];
    
    switch (filterStatus) {
      case "published":
        filtered = filtered.filter((p: Post) => p.isPublished);
        break;
      case "draft":
        filtered = filtered.filter((p: Post) => !p.isPublished);
        break;
      case "featured":
        filtered = filtered.filter((p: Post) => p.isFeaturedPost);
        break;
      default:
        break;
    }
    
    return filtered;
  }, [data?.posts, filterStatus]);

  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setSize(pageSize);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getAuthorInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getInitialsBgColor = (email: string) => {
    const colors = [
      "from-blue-500 to-purple-500",
      "from-emerald-500 to-cyan-500",
      "from-rose-500 to-pink-500",
      "from-amber-500 to-orange-500",
      "from-violet-500 to-indigo-500",
    ];
    return colors[email.charCodeAt(0) % colors.length];
  };

  const getTopicBadges = (topics: Topic[]) => {
    return topics.map((topic) => (
      <span
        key={topic._id}
        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm transition-all duration-200 hover:scale-105 cursor-default"
        style={{ 
          backgroundColor: `${topic.color}15`, 
          color: topic.color,
          borderColor: `${topic.color}35`,
          boxShadow: `0 0 12px ${topic.color}20`
        }}
      >
        {topic.title}
      </span>
    ));
  };

  const getStatusBadge = (isPublished: boolean, isFeatured: boolean = false) => {
    if (isFeatured) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all duration-300">
          <i className="fas fa-star text-xs"></i>
          Featured
        </span>
      );
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 ${
          isPublished
            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.35)]"
            : "bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_20px_rgba(245,158,11,0.35)]"
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${isPublished ? "bg-emerald-400" : "bg-amber-400"}`}></span>
        {isPublished ? "Published" : "Draft"}
      </span>
    );
  };

  const StatCard = ({ icon, label, count, color, isActive }: { icon: string; label: string; count: number; color: string; isActive: boolean }) => (
    <button
      onClick={() => {
        if (label === "All Posts") setFilterStatus("all");
        else if (label === "Published") setFilterStatus("published");
        else if (label === "Drafts") setFilterStatus("draft");
        else if (label === "Featured") setFilterStatus("featured");
      }}
      className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 group ${
        isActive
          ? `bg-gradient-to-br ${color} border-${color.split(" ")[1]}/60 shadow-lg shadow-${color.split(" ")[1]}/20`
          : "bg-[#141624]/40 border-gray-800/40 hover:border-gray-700/60 hover:bg-[#0f1119]/60"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-xs uppercase tracking-wider font-semibold ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-300"} transition-colors`}>
            {label}
          </p>
          <p className={`text-2xl font-bold mt-1 ${isActive ? "text-white" : "text-gray-200"}`}>
            {count}
          </p>
        </div>
        <i className={`${icon} text-3xl ${isActive ? "text-white/80" : "text-gray-500 group-hover:text-gray-400"} transition-colors`}></i>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#1a1d2d] via-[#141624] to-[#0f1119] border-b border-gray-800/60 overflow-hidden relative">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative px-6 py-8 lg:px-8 lg:py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Posts Management</h1>
            </div>
            <p className="text-gray-400 text-sm lg:text-base max-w-2xl">
              Create, manage, and organize your blog posts. Monitor engagement metrics, publish content, and track post performance all in one place.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            <StatCard icon="fas fa-file" label="All Posts" count={filterStats.total} color="from-blue-600/20 to-blue-500/10" isActive={filterStatus === "all"} />
            <StatCard icon="fas fa-check-circle" label="Published" count={filterStats.published} color="from-emerald-600/20 to-emerald-500/10" isActive={filterStatus === "published"} />
            <StatCard icon="fas fa-file-alt" label="Drafts" count={filterStats.drafts} color="from-amber-600/20 to-amber-500/10" isActive={filterStatus === "draft"} />
            <StatCard icon="fas fa-star" label="Featured" count={filterStats.featured} color="from-purple-600/20 to-purple-500/10" isActive={filterStatus === "featured"} />
          </div>

          {/* Search and Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search Bar */}
            <div className="flex-1 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-300"></div>
              <div className="relative flex items-center bg-[#0f1119] border border-gray-700/50 rounded-xl px-4 py-3 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300 hover:border-gray-600/50">
                <i className="fas fa-search text-gray-500 group-focus-within:text-blue-400 mr-3 transition-colors"></i>
                <input
                  type="text"
                  className="flex-1 bg-transparent text-gray-200 placeholder:text-gray-500 outline-none text-sm"
                  placeholder="Search posts by title, tag, or author..."
                  value={searchTerm}
                  onChange={handleSearch}
                  aria-label="Search posts"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-2 text-gray-500 hover:text-gray-300 transition-colors p-1"
                    aria-label="Clear search"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>

            {/* New Post Button */}
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center justify-center gap-2 whitespace-nowrap">
              <i className="fas fa-plus"></i>
              New Post
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="px-6 py-8 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-inbox text-4xl text-gray-600 mb-4 block"></i>
            <p className="text-gray-400">No posts found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPosts.map((post: Post) => (
              <div 
                key={post._id}
                className="bg-[#141624]/60 border border-gray-800/60 rounded-xl p-4 lg:p-6 transition-all duration-300 hover:border-gray-700/80 hover:bg-[#0f1119]/80 group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Post Image & Title */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {post.imageURL && (
                      <div className="flex-shrink-0 h-16 w-16 relative overflow-hidden rounded-xl shadow-md ring-1 ring-white/10 group-hover:ring-blue-500/30 transition-all duration-300">
                        <img
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                          src={post.imageURL}
                          alt={post.title}
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base lg:text-lg font-semibold text-gray-200 group-hover:text-blue-300 transition-colors duration-200 truncate">
                        {post.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-2">
                        <i className="fas fa-tag"></i>
                        {post.tag}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {getTopicBadges(post.topic).slice(0, 2)}
                        {post.topic.length > 2 && (
                          <span className="text-xs text-gray-500">+{post.topic.length - 2} more</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Author Avatar */}
                  <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getInitialsBgColor(post.author.email)} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                      {getAuthorInitials(post.author.name)}
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-300">{post.author.name}</p>
                      <p className="text-xs text-gray-500">{post.author.email}</p>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
                    {getStatusBadge(post.isPublished, post.isFeaturedPost)}
                    {post.isPublished && !post.isFeaturedPost && (
                      <div className="text-xs px-2.5 py-1.5 rounded-full text-gray-400 bg-gray-800/40">
                        {formatDate(post.createdAt)}
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="hidden lg:flex items-center gap-6 flex-shrink-0 py-2">
                    <div className="text-center group/stat">
                      <div className="flex items-center justify-center gap-1.5 text-gray-300 group-hover/stat:text-rose-400 transition-colors">
                        <i className="fas fa-heart text-sm"></i>
                        <span className="text-sm font-semibold">{post.likesCount}</span>
                      </div>
                    </div>
                    <div className="text-center group/stat">
                      <div className="flex items-center justify-center gap-1.5 text-gray-300 group-hover/stat:text-blue-400 transition-colors">
                        <i className="fas fa-comment text-sm"></i>
                        <span className="text-sm font-semibold">{post.commentsCount}</span>
                      </div>
                    </div>
                    <div className="text-center group/stat">
                      <div className="flex items-center justify-center gap-1.5 text-gray-300 group-hover/stat:text-emerald-400 transition-colors">
                        <i className="fas fa-eye text-sm"></i>
                        <span className="text-sm font-semibold">{post.viewsCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-800/40">
                    <button 
                      className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40 hover:text-blue-300 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 hover:scale-110 active:scale-95"
                      title="Edit post"
                      aria-label="Edit post"
                    >
                      <i className="fas fa-edit text-sm"></i>
                    </button>
                    <button 
                      className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-300 hover:shadow-lg hover:shadow-rose-500/20 transition-all duration-200 hover:scale-110 active:scale-95"
                      title="Delete post"
                      aria-label="Delete post"
                    >
                      <i className="fas fa-trash-alt text-sm"></i>
                    </button>
                    <button 
                      className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-700/20 text-gray-400 border border-gray-700/40 hover:bg-gray-700/40 hover:border-gray-600/60 hover:text-gray-300 hover:shadow-lg hover:shadow-gray-500/10 transition-all duration-200 hover:scale-110 active:scale-95"
                      title="More actions"
                      aria-label="More actions"
                    >
                      <i className="fas fa-ellipsis-v text-sm"></i>
                    </button>
                  </div>
                </div>

                {/* Mobile Stats Row */}
                <div className="lg:hidden mt-4 pt-4 border-t border-gray-800/40 flex justify-around">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 text-gray-300 text-sm">
                      <i className="fas fa-heart text-xs"></i>
                      <span className="font-semibold">{post.likesCount}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Likes</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 text-gray-300 text-sm">
                      <i className="fas fa-comment text-xs"></i>
                      <span className="font-semibold">{post.commentsCount}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Comments</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 text-gray-300 text-sm">
                      <i className="fas fa-eye text-xs"></i>
                      <span className="font-semibold">{post.viewsCount}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Views</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Section */}
      {data?.meta && (
        <div className="px-6 py-8 lg:px-8 border-t border-gray-800/60">
          <PaginationComponent
            current={page}
            pageSize={size}
            total={data.meta.total}
            onChange={onPaginationChange}
          />
        </div>
      )}
    </div>
  );
};

export default PostListsComponent;
