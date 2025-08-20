import React from 'react';
import {Box, Grid, Typography} from "@mui/material";
import TestimonialsCard from "../components/TestimonialsCard.jsx";
import TestimonialsVideo from "../assets/videos/1.mp4";

const Testimonials = () => {

    const testimonials = [
        {
            comment: "Overall, the concept of this project will be beneficial for students seeking the most suitable A/L stream that aligns with their strengths and future goals.",
            name: "Mr.Pasindu Dissanayake - Senior TechOps Engineer at OrangeHRM Inc."
        },
        {
            comment: "Overall, this is a very thoughtful and well-planned project. It focuses on a real problem that many students face , not knowing which A/L subjects to choose or how to plan for university. The idea of using a chatbot to give personal advice makes the process easier and more accessible for students.The system already covers the most important parts, and the future improvements show that the Thenuka is thinking ahead. Features like multi-language support and visual tools will make it even more helpful for students. It’s a smart use of technology to support education, and with some more development, this project could make a big difference in the lives of many students. Well done.",
            name: "Ms.D.M.S.Nuwanmali Dissanayake - Project Manager at Omobio Pvt Ltd"
        },
        {
            comment: "Overall, this is a well-conceived and socially impactful project that addresses a significant gap in Sri Lanka's education system. The concept of using AI or smart decision-support systems to guide students in making one of their earliest and most critical academic choices is commendable. It reflects a deep understanding of local challenges faced by students and the potential for technology to bridge those gaps. The integration of personalized recommendations based on user preferences, interests, and long-term goals adds value and distinguishes the project from traditional, one-size-fits-all guidance methods. The chatbot interface makes the system approachable and user-friendly, especially for younger audiences. With further refinement in terms of machine learning implementation, UX design, and language accessibility, this platform has the potential to scale and make a real difference in students' lives. It’s a meaningful initiative that blends technology, education, and social impact effectively.",
            name: "Pamuditha Jayasiri - Software Engineer at IFS"
        },
    ];

    return (
        <Grid container xs={12}>
            <Grid item xs={12}>
                <Box sx={{display: 'flex', gap: 1, justifyContent: 'center', m: 1}}>
                    <Typography sx={{fontWeight: 600, fontSize: 30}}>
                        Our
                    </Typography>
                    <Typography sx={{fontWeight: 600, fontSize: 30, color: '#7095DE'}}>
                        FeedBack
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center', m: 2}}>
                <video width="640" height="360" controls>
                    <source src={TestimonialsVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </Grid>
            <Grid item xs={12}>
            </Grid>
            <Grid container spacing={3} justifyContent="center" sx={{m: 2}}>
                {testimonials.map((testimonial, index) => (
                    <Grid item key={index} xs={12} sm={6} md={3} sx={{display: 'flex', justifyContent: 'center'}}>
                        <TestimonialsCard testimonial={testimonial}/>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
};

export default Testimonials;