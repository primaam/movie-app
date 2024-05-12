import React from "react";
import "./App.css";
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
    Box,
} from "@mui/material";
import { MovieData } from "./util/FakeData";

function App() {
    const [searchText, setSearchText] = React.useState("");
    const [bookmarks, setBookmarks] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [newMovieData, setNewMovieData] = React.useState({
        title: "",
        rating: 0,
        releaseDate: "",
    });

    const [rows, setRows] = React.useState(
        MovieData.results.map((row, index) => ({
            ...row,
            serial: index + 1,
        }))
    );

    const filteredRows = rows.filter((row) => {
        return row.title.toLowerCase().includes(searchText.toLowerCase());
    });

    const columns = [
        { field: "serial", headerName: "No.", width: 40 },
        { field: "title", headerName: "Title", minWidth: 300 },
        { field: "release_date", headerName: "Release Date", width: 130 },
        {
            field: "vote_average",
            headerName: "Rating",
        },
        {
            field: "bookmark",
            headerName: "Bookmark",
            sortable: false,
            renderCell: (params) =>
                bookmarks.includes(params.id) ? (
                    <StarIcon onClick={() => toggleBookmark(params.id)} />
                ) : (
                    <StarBorderIcon onClick={() => toggleBookmark(params.id)} />
                ),
        },
        {
            field: "delete",
            headerName: "Delete",
            sortable: false,
            width: 100,
            renderCell: (params) => (
                <IconButton onClick={() => handleDelete(params.row.id)}>
                    <DeleteIcon />
                </IconButton>
            ),
        },
    ];
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
    };

    const toggleBookmark = (id) => {
        setBookmarks(
            bookmarks.includes(id) ? bookmarks.filter((b) => b !== id) : [...bookmarks, id]
        );
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNewMovieData({
            rating: 0,
            releaseDate: "",
            title: "",
        });
    };

    const handleChange = (e) => {
        setNewMovieData({ ...newMovieData, [e.target.name]: e.target.value });
        if (e.target.name === "rating") {
            const res = parseInt(e.target.value);
            setNewMovieData({ ...newMovieData, rating: res > 10 ? 10 : res });
        } else {
            setNewMovieData({ ...newMovieData, [e.target.name]: e.target.value });
        }
    };

    console.log(rows);

    return (
        <div className="App">
            <input type="text" value={searchText} onChange={handleSearch} placeholder="Search..." />
            <Box
                sx={{
                    height: 400,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    rowsPerPageOptions={[5, 10, 15]}
                    sx={{
                        width: "auto",
                        maxWidth: 800,
                        "& .MuiDataGrid-root": {
                            border: "none",
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "primary.main",
                            fontSize: "1rem",
                        },
                    }}
                />
            </Box>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Add Movie
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
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
                        id="rating"
                        label="Rating"
                        type="number"
                        fullWidth
                        name="rating"
                        value={newMovieData.rating}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        id="releaseDate"
                        label="Release Date"
                        type="date"
                        fullWidth
                        name="releaseDate"
                        value={newMovieData.releaseDate}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default App;
