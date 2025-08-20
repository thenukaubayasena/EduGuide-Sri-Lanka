import React, { useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    Typography,
    IconButton,
    Button,
    Box,
    Chip,
    LinearProgress,
    Divider
} from '@mui/material';
import { X as CloseIcon } from 'lucide-react';
import Physical_Science from '../assets/streamIcons/physical_science.png';
import Bio_Science from '../assets/streamIcons/bio_science.png';
import Commerce from '../assets/streamIcons/commerce.png';
import Arts from '../assets/streamIcons/art.png';
import Technology from '../assets/streamIcons/technology.png';

const streamDescriptions = {
    "Physical Science": "Based on your interest and the data given by you, we suggest physical science stream as you have strong analytical and logical reasoning skills",
    "Bio Science": "Based on your interest and the data given by you, we suggest bio science stream as you have life sciences",
    Commerce: "Based on your interest and the data given by you, we suggest commerce stream as you have business acumen and financial understanding",
    Arts: "Based on your interest and the data given by you, we suggest arts stream as you have creative thinking and analytical abilities",
    Technology: "Based on your interest and the data given by you, we suggest technology stream as you have strong aptitude for engineering concepts, practical applications, and technical problem-solving skills in areas like electronics, mechanics, and engineering science",
};

const streamIconMap = {
    "Bio Science": Bio_Science,
    "Physical Science": Physical_Science,
    Commerce: Commerce,
    Arts: Arts,
    Technology: Technology
};

const StreamResultDialog = ({ open, onClose, response }) => {
    const streamName = response?.predicted_stream || 'Science';
    const confidence = response?.confidence || 0;
    const successProbability = response?.success_probability || 0;
    const interpretation = response?.interpretation || '';

    useEffect(() => {
        console.log("response : ", response);
    }, [response]);

    // Helper function to determine color based on value
    const getConfidenceColor = (value) => {
        if (value > 0.7) return '#4caf50'; // green
        if (value > 0.4) return '#ff9800'; // orange
        return '#f44336'; // red
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    p: 2
                }
            }}
        >
            <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon size={20} />
                </IconButton>
            </Box>

            <DialogContent>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 2
                }}>
                    <Box component='img' src={streamIconMap[streamName]} width={80} height={80} />

                    <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                        {streamName} Stream
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                        {streamDescriptions[streamName]}
                    </Typography>

                    <Divider sx={{ width: '100%', my: 1 }} />

                    {/* Model Confidence Section */}
                    <Box sx={{ width: '100%', textAlign: 'left' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" fontWeight={500}>
                                Prediction Confidence
                            </Typography>
                            <Chip
                                label={`${(confidence * 100).toFixed(1)}%`}
                                size="small"
                                sx={{
                                    bgcolor: getConfidenceColor(confidence),
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}
                            />
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={confidence * 100}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: '#e0e0e0',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: getConfidenceColor(confidence)
                                }
                            }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                            This indicates how confident our model is in this recommendation
                        </Typography>
                    </Box>

                    {/* Success Probability Section */}
                    <Box sx={{ width: '100%', textAlign: 'left', mt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" fontWeight={500}>
                                Success Probability
                            </Typography>
                            <Chip
                                label={`${successProbability.toFixed(1)}%`}
                                size="small"
                                sx={{
                                    bgcolor: getConfidenceColor(successProbability / 100),
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}
                            />
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={successProbability}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: '#e0e0e0',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: getConfidenceColor(successProbability / 100)
                                }
                            }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                            {interpretation}
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={onClose}
                        sx={{
                            backgroundColor: 'primary.main',
                            color: 'white',
                            py: 1.5,
                            mt: 1,
                            borderRadius: 1,
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                            }
                        }}
                    >
                        OK
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default StreamResultDialog;