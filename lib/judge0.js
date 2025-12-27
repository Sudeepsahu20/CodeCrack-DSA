import axios from "axios";

export function getJudge0LanguageId(language){
    const languageMap={
        "JAVASCRIPT":63,
        "PYTHON":71,
        "JAVA":62,
        "CPP":54,
        "GO":60,
    }
    return languageMap[language.toUpperCase()];
}

export function getLanguageName(languageId) {
  const map = {
    63: "JavaScript",
    71: "Python",
    62: "Java",
    54: "C++",
    60: "Go",
  };
  return map[languageId];
}



export async function submitBatch(submissions) {
    const {data}=await axios.post(
        `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
        {submissions}

    );
    console.log('Batch submission responase:',data);
    return data;
}

export async function pollBatchResults(tokens){
    while(true){
        const {data}=await axios.post(
           `${process.env.JUDGE0_API_URL}/submissions/batch`,
             {
        params: {
          tokens: tokens.join(","),
          base64_encoded: false,
        },
      });
      console.log(data);
      const result=data.submissions;

      const isAllDone=result.every((res)=>res.status.id !==1 && res.status.id !==2);
      if(isAllDone){
        return result;
      }
      await sleep(1000);
    }
}

export const sleep=(ms)=> new Promise((resolve)=>setTimeout(resolve,ms));