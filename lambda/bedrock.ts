import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

/**
 *
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 */

export const handler = async (event) => {
  try {
    const client = new BedrockRuntimeClient({
      region: "us-east-1",
    });

    const prompt = `Sei un'Intelligenza Artificiale specializzata nello sviluppo di software agile. Il tuo compito è generare user stories dettagliate basate sulla descrizione di una epic story fornita. Le user stories devono essere scritte nel formato standard "Come [tipo di utente], voglio [azione] in modo da [beneficio]". Ogni user story deve essere chiara, concisa e contenere dettagli specifici che facilitino la comprensione del lavoro da svolgere.
Linee guida:

    Identifica i ruoli degli utenti: Identifica i diversi tipi di utenti che interagiranno con il sistema descritto nella epic story.
    Definisci le azioni: Descrivi le azioni specifiche che questi utenti devono poter compiere.
    Specifica i benefici: Indica chiaramente i benefici o gli obiettivi che gli utenti intendono raggiungere compiendo queste azioni.
    Dettagli tecnici e funzionali: Includi dettagli tecnici o funzionali rilevanti che potrebbero essere utili per lo sviluppo della user story.

Esempio di input JSON:

json

{
  "epicStory": "Come utente di una piattaforma di e-learning, voglio poter accedere a corsi online, seguire lezioni in tempo reale, e monitorare i miei progressi attraverso un dashboard personalizzato per migliorare le mie competenze professionali."
}

Esempio di output JSON:

json

{
  "userStories": [
    {
      "description": "Da studente voglio cercare e iscrivermi a corsi online per iniziare rapidamente ad apprendere nuove competenze"
    },
    {
      "description": "Da studente voglio partecipare a lezioni in tempo reale con un sistema di videoconferenza integrato per interagire direttamente con gli istruttori e altri studenti",
    },
    {
      "description": "Da studente voglio visualizzare un dashboard personalizzato che mostri i miei progressi nei vari corsi per monitorare e valutare il mio apprendimento",
    },
    {
      "description": "Da insegnante voglio caricare e gestire i contenuti dei corsi per mantenere aggiornato il materiale didattico",
    }
  ]
}

Input:

json

{
  "epicStory": "[Inserisci qui la descrizione della epic story]"
}

Output desiderato:

Genera un elenco di user stories in formato JSON, seguendo il formato e gli esempi forniti. Assicurati che ogni user story sia dettagliata e includa tutte le informazioni necessarie per comprenderne l'implementazione.
Il prompt è: ${event.queryStringParameters.message}`;

    const req = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 100000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    };
    const input = {
      modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(req),
    };

    const command = new InvokeModelCommand(input);
    const data = await client.send(command);
    let decoder = new TextDecoder();
    let text = decoder.decode(data.body);

    return {
      statusCode: 200,
      body: text,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  } catch (e) {
    return { statusCode: 502, body: JSON.stringify(e) };
  }
};
