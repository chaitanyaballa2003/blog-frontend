const API_URL = "http://localhost:8080/api/posts";

// Load all posts when the page opens
document.addEventListener("DOMContentLoaded", fetchPosts);

async function fetchPosts() {
    const container = document.getElementById("postsContainer");
    try {
        const response = await fetch(API_URL);
        const posts = await response.json();

        if (posts.length === 0) {
            container.innerHTML = "<p>No posts yet. Write your first blog post above!</p>";
            return;
        }

        // Show newest posts first
        posts.reverse();

        container.innerHTML = posts.map(post => `
            <article class="post-card">
                <h3>${escapeHtml(post.title)}</h3>
                <div class="post-meta">By <strong>${escapeHtml(post.author)}</strong> • ${new Date(post.createdAt).toLocaleString()}</div>
                <p class="post-content">${escapeHtml(post.content)}</p>
                <button class="delete-btn" onclick="deletePost(${post.id})">Delete</button>
            </article>
        `).join("");
    } catch (error) {
        container.innerHTML = "<p style='color:red;'>Could not connect to Spring Boot backend. Make sure it is running on port 8080.</p>";
    }
}

// Create a new post
document.getElementById("postForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPost = {
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        content: document.getElementById("content").value
    };

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost)
    });

    document.getElementById("postForm").reset();
    fetchPosts();
});

// Delete a post
async function deletePost(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchPosts();
}

// Prevent HTML injection
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}