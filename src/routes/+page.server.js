import { Configuration, OpenAIApi } from 'openai';

import {INFOJOBS_APIKEY} from '$env/static/private'
import { OPENAI_APIKEY, OPENAI_ORGID } from '$env/static/private';

/** @type {import('../$types').PageServerLoad} */
export async function load({params}){
    console.log(params)
    const res = await fetch('https://api.infojobs.net/api/9/offer', {headers: {'Authorization': 'Basic ' + INFOJOBS_APIKEY}})
    const data = await res.json()

    return { 
        offers: data.offers
    }

}

const configuration = new Configuration({
    organization: OPENAI_ORGID,
    apiKey: OPENAI_APIKEY
});
const openai = new OpenAIApi(configuration);

const messages = [
    {
        role: 'system',
        content:
            `Tu eres Elliebot un asistente virtual de Infojobs experta en temas de CV, propuestas de trabajo, recursos humanos, etc.
            Tu trabajo es asistir apersonas que tengan dudas o consultas.
            Tus respuestas deben de ser cortas y claras, faciles de entender y de mucha ayuda para el usuario.
            Solo tienes permitido responder temas con respecto a busqueda de empleo, es muy importante que respetes la siguiente regla: si te preguntan sobre otros temas responde amablemente que no puedes responder eso.`
    }
];


/** @type {import('./$types').Actions} */
export const actions = {
	ai: async ({ request }) => {
		const data = await request.formData();
		const msg = data.get('msg');
        messages.push({
            role: 'user',
            content: msg
        })

        console.log(messages)
		const completion = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages
		});

		const response = completion.data.choices[0].message;

		return response;
	},
};

