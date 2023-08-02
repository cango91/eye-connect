const classifyImage = async (buffer, contentType) => {
    let predictionValue = -1;
    try {
        const data = new FormData();
        data.append('image', new Blob([buffer], { type: contentType }))
        const response = await fetch(process.env.AI_API_URL, {
            method: 'POST',
            headers: {
                'X-Api-Key': process.env.AI_API_KEY
            },
            body: data,
        });
        if (response.ok) {
            const predictionData = await response.json();
            predictionValue = predictionData.prediction[0][0];
            console.log(`remote model predicted: ${predictionValue}`);
        } else {
            throw new Error(`${response.status}: ` + await response.text())
        }

    } catch (error) {
        console.error(`Couldn't get prediction\n${error}`);
    }
    console.log(predictionValue);
    return describeResult(predictionValue);
}

const describeResult = result => {
    let resultString;
    if (result < 0) {
        resultString = 'Could not reach AI service';
    } else {
        let confidence;
        if (result > 0.995 || result < 0.005) {
            confidence = "high"
        } else if (result > 0.95 || result < 0.05) {
            confidence = "low"
        } else {
            confidence = "very low"
        }
        if (result > .75 || result < .25) {
            resultString = `This image was automatically classified ${result > 0.5 ? 'POSITIVE' : 'NEGATIVE'} with ${confidence} confidence for diabetic retinopathy. The results must be verified by a specialist, as the model might miss early signs of NPDR or conversely, mis-diagnose a healthy patient`;
        } else {
            resultString = 'The classification attempt was inconclusive. Must be consulted to a specialist';
        }
    }
    return { result: resultString, value: result };
}

module.exports = {
    classifyImage
}