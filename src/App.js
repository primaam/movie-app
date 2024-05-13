import "./App.css";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    IconButton,
    MenuItem,
    Box,
    Snackbar,
    CircularProgress,
    Typography,
    createTheme,
    ThemeProvider,
    useTheme,
} from "@mui/material";

import { getMovieData } from "./redux/action/movieAct";
import { storeMovieData } from "./redux/reducer/movieRed";
import { MovieData } from "./util/FakeData";

const lightTheme = createTheme({
    palette: {
        mode: "light",
        background: {
            default: "#ffffff",
            paper: "#f7f7f7",
        },
        text: {
            primary: "#000000",
            secondary: "#555555",
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "#121212",
            paper: "#1e1e1e",
        },
        text: {
            primary: "#ffffff",
            secondary: "#bbbbbb",
        },
    },
});

function App() {
    const muiTheme = useTheme();
    const dispatch = useDispatch();
    const movieDataRes = useSelector(({ MovieStore }) => MovieStore.data);

    const [themeMode, setThemeMode] = React.useState("light");
    const theme = themeMode === "light" ? lightTheme : darkTheme;

    const [searchText, setSearchText] = React.useState("");
    const [bookmarks, setBookmarks] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [notification, setNotification] = React.useState({
        message: "",
        open: false,
    });
    const [newMovieData, setNewMovieData] = React.useState({
        title: "",
        vote_average: 0,
        release_date: "",
        adult: false,
    });
    const [rows, setRows] = React.useState(
        movieDataRes.map((row, index) => ({
            ...row,
            serial: index + 1,
        }))
    );
    const [filterRows, setFilterRows] = React.useState([]);

    const columns = [
        { field: "serial", headerName: "No.", width: 40 },
        { field: "title", headerName: "Title", minWidth: 300 },
        { field: "release_date", headerName: "Release Date", width: 130 },
        {
            field: "adult",
            headerName: "18+",
            // width: 130,
            renderCell: (params) => {
                return <div>{params.row.adult === false ? "No" : "Yes"}</div>;
            },
        },
        {
            field: "vote_average",
            headerName: "Rating",
        },
        {
            field: "bookmark",
            headerName: "Bookmark",
            sortable: false,
            renderCell: (params) => (
                <div className="bookmarkCell">
                    {bookmarks.includes(params.id) ? (
                        <StarIcon
                            style={{ color: "orange" }}
                            onClick={() => toggleBookmark(params.id)}
                        />
                    ) : (
                        <StarBorderIcon onClick={() => toggleBookmark(params.id)} />
                    )}
                </div>
            ),
        },
        {
            field: "delete",
            headerName: "Delete",
            sortable: false,
            renderCell: (params) => (
                <IconButton onClick={() => handleDelete(params.row.id)}>
                    <DeleteIcon />
                </IconButton>
            ),
        },
    ];

    const adultOpt = [
        { value: false, label: "No" },
        { value: true, label: "Yes" },
    ];

    React.useEffect(() => {
        const fetchData = async () => {
            const res = await getMovieData();

            dispatch(storeMovieData(res.data.results));

            setTimeout(() => {
                setRows(
                    res.data.results.map((row, index) => ({
                        ...row,
                        serial: index + 1,
                    }))
                );
            }, 3000);
        };

        fetchData();
    }, []);

    const toggleTheme = () => {
        setThemeMode(themeMode === "light" ? "dark" : "light");
    };

    const handleDelete = (id) => {
        const newRows = rows.filter((row) => row.id !== id);
        setRows(
            newRows.map((row, index) => ({
                ...row,
                serial: index + 1,
            }))
        );
    };

    const handleSearch = (event) => {
        setSearchText(event.target.value);
        const filteredRows = rows.filter((row) => {
            return row.title.toLowerCase().includes(searchText.toLowerCase());
        });

        setFilterRows(
            filteredRows.map((row, index) => ({
                ...row,
                serial: index + 1,
            }))
        );
    };

    const toggleBookmark = (id) => {
        setBookmarks(
            bookmarks.includes(id) ? bookmarks.filter((b) => b !== id) : [...bookmarks, id]
        );
    };

    const handleShowPopup = () => {
        if (open === false) {
            setOpen(true);
        } else {
            setOpen(false);
            setNewMovieData({
                vote_average: 0,
                release_date: "",
                title: "",
                adult: false,
            });
        }
    };

    const handleChange = (e) => {
        if (e.target.name === "vote_average") {
            const res = parseInt(e.target.value);
            setNewMovieData({ ...newMovieData, vote_average: res > 10 ? 10 : res });
        } else {
            setNewMovieData({ ...newMovieData, [e.target.name]: e.target.value });
        }
    };

    const handleAddMovie = () => {
        const newMovie = {
            ...newMovieData,
            id: Date.now(),
            serial: rows.length + 1,
        };
        if (newMovieData.release_date.length > 0 || newMovieData.title.length > 0) {
            setRows([...rows, newMovie]);
            setOpen(false);
            setNewMovieData({
                title: "",
                vote_average: 0,
                release_date: "",
                adult: false,
            });
            setNotification({
                message: "Success input new movie",
                open: true,
            });
        } else {
            setNotification({
                message: "Please fill all the form field first",
                open: true,
            });
        }
    };

    const handleNotifClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setNotification({
            message: "",
            open: false,
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <div
                    className="container"
                    style={{
                        backgroundColor: muiTheme.palette.background.default,
                        color: muiTheme.palette.text.primary,
                        padding: "20px",
                    }}
                >
                    {movieDataRes.length > 0 ? (
                        <>
                            <div className="headerListContainer">
                                <input
                                    type="text"
                                    value={searchText}
                                    onChange={handleSearch}
                                    placeholder="Search..."
                                    className="searchContainer"
                                />

                                <div>
                                    <Button
                                        className="button"
                                        variant="outlined"
                                        color="primary"
                                        onClick={handleShowPopup}
                                    >
                                        Add Movie
                                    </Button>
                                    <br />
                                    <br />

                                    <Button
                                        variant="outlined"
                                        className="button"
                                        onClick={toggleTheme}
                                    >
                                        Switch to {themeMode === "light" ? "Dark" : "Light"} Mode
                                    </Button>
                                </div>
                            </div>

                            <Box
                                sx={{
                                    // height: 600,
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <DataGrid
                                    rows={searchText.length > 0 ? filterRows : rows}
                                    columns={columns}
                                    initialState={{
                                        pagination: {
                                            paginationModel: { page: 0, pageSize: 10 },
                                        },
                                    }}
                                    rowsPerPageOptions={[5, 10, 15]}
                                    sx={{
                                        width: "auto",
                                        "& .MuiDataGrid-root": {
                                            border: "none",
                                        },
                                        "& .MuiDataGrid-columnHeaders": {
                                            backgroundColor: "primary.main",
                                            fontSize: "1rem",
                                        },
                                        "& .MuiDataGrid-cell": {
                                            color: muiTheme.palette.text.primary,
                                        },
                                        "& .MuiDataGrid-footer": {
                                            color: muiTheme.palette.text.primary,
                                        },
                                    }}
                                />
                            </Box>

                            <Dialog open={open} onClose={handleShowPopup}>
                                <DialogTitle id="form-dialog-title">Add New Movie</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="title"
                                        label="Movie Title"
                                        type="text"
                                        fullWidth
                                        name="title"
                                        value={newMovieData.title}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        margin="dense"
                                        id="vote_average"
                                        label="Rating"
                                        type="number"
                                        fullWidth
                                        name="vote_average"
                                        value={newMovieData.vote_average}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        margin="dense"
                                        id="release_date"
                                        label="Release Date"
                                        type="date"
                                        fullWidth
                                        name="release_date"
                                        value={newMovieData.release_date}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    <TextField
                                        margin="dense"
                                        fullWidth
                                        id="adult"
                                        select
                                        name="adult"
                                        label="Adult Movie"
                                        defaultValue="false"
                                        onChange={handleChange}
                                    >
                                        {adultOpt.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleShowPopup} color="primary">
                                        Cancel
                                    </Button>
                                    <Button onClick={handleAddMovie} color="primary">
                                        Add
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            <Snackbar
                                open={notification.open}
                                autoHideDuration={3000}
                                onClose={handleNotifClose}
                                message={`${notification.message}`}
                            />
                        </>
                    ) : (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column",
                                height: "70vh",
                            }}
                        >
                            <CircularProgress color="primary" size={80} />
                            <br />
                            <br />
                            <Typography
                                style={{
                                    fontSize: 30,
                                }}
                            >
                                Please wait while fetching a new data
                            </Typography>
                        </Box>
                    )}
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;
