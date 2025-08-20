import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    Grid,
    Box,
    Slider
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SuggestionService from "../services/SuggestionService.js";
import StreamResultDialog from "./StreamResultDialog.jsx";

const questions = [
    { id: 1, text: "O/L Mathematics Grade:", type: "select", options: ["A", "B", "C", "S", "W"] },
    { id: 2, text: "O/L Science Grade:", type: "select", options: ["A", "B", "C", "S", "W"] },
    { id: 3, text: "O/L Religion Grade:", type: "select", options: ["A", "B", "C", "S", "W"] },
    { id: 4, text: "O/L English Grade:", type: "select", options: ["A", "B", "C", "S", "W"] },
    { id: 5, text: "O/L Sinhala or Tamil Grade:", type: "select", options: ["A", "B", "C", "S", "W"] },
    { id: 6, text: "O/L History Grade:", type: "select", options: ["A", "B", "C", "S", "W"] },
    { id: 7, text: "O/L Basket 1 Grade:", type: "select", options: ["A", "B", "C", "S", "W"] },
    { id: 8, text: "O/L Basket 2 Grade:", type: "select", options: ["A", "B", "C", "S", "W"] },
    { id: 9, text: "O/L Basket 3 Grade:", type: "select", options: ["A", "B", "C", "S", "W"] },
    { id: 10, text: "Enter your Favorite Subject:", type: "select", options: ["maths", "science", "ict", "commerce", "english", "history", "geography", "french", "agri", "dancing", "literature", "sinhala", "art", "japanese", "music", "tamil", "german", "technology"] },
    { id: 11, text: "Enter your Career Interest:", type: "select", options: ["IT/ Software Developer", "Engineer", "Designer", "Lecturer/ Professor", "Teacher", "Businessman", "Business Analysis/ Business Manager/ BIS", "Accountant", "Medical Industry", "Chemist", "Banker", "Aviation", "Finance", "Manager", "Lawyer", "Hotel Industry", "Food Scientist", "Sportsman", "Tourism", "Agriculture Industry", "Laboratary Side", "Microbiologist", "HR", "Music Industry", "Photographer", "Other"] },
];

const StudyPathForm = () => {
    const [open, setOpen] = useState(false);
    const [response, setResponse] = useState(null);

    const { control, handleSubmit, reset } = useForm({
        defaultValues: questions.reduce((acc, q) => ({
            ...acc,
            [`question${q.id}`]: q.type === "slider" ? 5 : ''
        }), {})
    });

    const gradeMapping = {
        'A': 5,
        'B': 4,
        'C': 3,
        'S': 2,
        'W': 1
    };

    const onSubmit = async (data) => {
        const unanswered = questions.some((q) => data[`question${q.id}`] === '');
        if (unanswered) {
            toast.error('Please answer all questions before submitting.');
            return;
        }

        const formattedData = {
            'Maths': gradeMapping[data.question1] ?? data.question1,
            'Science': gradeMapping[data.question2] ?? data.question2,
            'Religion': gradeMapping[data.question3] ?? data.question3,
            'English': gradeMapping[data.question4] ?? data.question4,
            'Sinhala or Tamil': gradeMapping[data.question5] ?? data.question5,
            'History': gradeMapping[data.question6] ?? data.question6,
            'Basket I': gradeMapping[data.question7] ?? data.question7,
            'Basket II': gradeMapping[data.question8] ?? data.question8,
            'Basket III': gradeMapping[data.question9] ?? data.question9,
            'Favorite Subject': data.question10,
            'Career': data.question11,
        };

        console.log('Formatted Data Sent to API:', formattedData);

        try {
            const response = await SuggestionService.suggestStream(formattedData);
            console.log('Response from API:', response);
            setResponse(response);
            setOpen(true);
        } catch (e) {
            console.error('Error in API call:', e);
            toast.error('Error in fetching stream suggestion. Please try again.');
        }
    };

    return (
        <Card sx={{ backgroundColor: '#F3F3F3', p: 2, overflow: 'auto', maxHeight: 600, scrollbarWidth: 'none' }}>
            <ToastContainer />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                    <Typography sx={{ fontSize: 22, fontWeight: 600, textAlign: 'center', maxWidth: 500 }}>
                        A/L STREAM RECOMMENDATION
                    </Typography>
                    <Typography sx={{ fontSize: 20, fontWeight: 600, textAlign: 'center', maxWidth: 500 }}>
                        Discover Your Ideal Study Path with EduGuide
                    </Typography>
                    {/* <Typography sx={{ fontSize: 15, fontWeight: 500, color: '#757575', textAlign: 'center', maxWidth: 800 }}>
                        Answer a few questions to discover the A/L stream that aligns with
                        your interests and goals. Let EduGuide guide you to the perfect
                        academic path!
                    </Typography> */}
                </Box>

                <Box m={1}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            {questions.map((question) => (
                                <Grid item xs={12} sm={6} md={4} key={question.id}>
                                    <Typography sx={{ fontWeight: 'bold', mb: 1 }}>{question.text}</Typography>
                                    <Controller
                                        name={`question${question.id}`}
                                        control={control}
                                        render={({ field }) => (
                                            question.type === "select" ? (
                                                <Select {...field} fullWidth variant="outlined">
                                                    {question.options.map((option, index) => (
                                                        <MenuItem key={index} value={option}>
                                                            {option}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            ) : question.type === "slider" ? (
                                                <Slider
                                                    {...field}
                                                    value={field.value || 5}
                                                    onChange={(_, value) => field.onChange(value)}
                                                    min={question.min}
                                                    max={question.max}
                                                    step={1}
                                                    marks
                                                />
                                            ) : (
                                                <TextField {...field} fullWidth variant="outlined" placeholder="Type your answer here" />
                                            )
                                        )}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        <Box mt={3}>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ backgroundColor: '#7095DE' }}
                            >
                                RECOMMEND THE BEST SUITABLE A/L STREAM
                            </Button>
                        </Box>
                    </form>
                </Box>
            </CardContent>
            <StreamResultDialog
                open={open}
                onClose={() => {
                    setOpen(false);
                    reset();
                }}
                response={response}
            />
        </Card>
    );
};

export default StudyPathForm;
