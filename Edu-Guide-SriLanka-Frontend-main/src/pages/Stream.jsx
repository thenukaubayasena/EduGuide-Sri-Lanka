import React from 'react';
import {Box, Grid} from "@mui/material";
import StreamImg from '../assets/stream/StreamImg.png';
import StudyPathForm from "../components/StudyPathForm.jsx";

const Stream = () => {
    return (
        <Grid container gap={4} mb={4} >
            <Grid item xs={12} md={4} m={5}>
                <Box component='img' src={StreamImg} width={450} height={535} ml={17.5}/>
            </Grid>
            <Grid item xs={12} md={6} m={2}>
                <StudyPathForm />
            </Grid>
        </Grid>
    );
};

export default Stream;