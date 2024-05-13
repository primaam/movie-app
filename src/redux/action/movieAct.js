import axios from "axios";

export const getMovieData = async (payload) => {
    const token =
        "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNWNiZmEzYWY0ZmUwMjlmMTkwYzhmYjA5ODZmZWIyYiIsInN1YiI6IjYyOTA0NDdlZDQ4Y2VlNmNiNDRjMTY4ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GO-TZISrQuKLjrja7WA_3uKUD7YSk7bpdyxCYp41MLY";

    return await axios({
        url: "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc",
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
