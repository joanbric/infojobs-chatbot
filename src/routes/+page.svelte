<script>
	import Chatbot from '$lib/components/Chatbot.svelte';
	import { onMount } from 'svelte';

	/** @type {import('./$types').PageData}*/
	export let data;
    onMount(() => {
      console.log(data)
    })
</script>

<h1>Infojobs con ayuda de chatbot</h1>
<a
	href={`https://www.infojobs.net/api/oauth/user-authorize/index.xhtml?scope=CV&client_id=2a40fd33f54a4d1aa92e6f87e8cf6d2e&redirect_uri=http://www.infojobs.net/core/oauth2vc/index.xhtml&response_type=200`}
	>Login</a
>

<ul class="list-offerts">
	{#each data.offers as offer}
		<li class="offert">
            <a href={offer.link} class="offer-link">
                <article>
                    <header>
                        <img src={offer.author.logoUrl || "https://components.infojobs.com/statics/images/pic-company-logo.png"} alt="{offer.author.name} logo" />
                        <div class="title-container">
                            <h3>{offer.title}</h3>
                            <a href={offer.author.uri}>{offer.author.name}</a>
                            <p>{offer.city} | {offer.teleworking?.value} | {offer.published}</p>
                        </div>
                    </header>
                    <div class="content" />
                    <footer />
                </article>
            </a>
		</li>
	{/each}
</ul>

<Chatbot />

<style>
    h1{
        text-align: center;
        padding: 2rem 0;
    }
    header{
        display: flex;
        gap: 15px;
    }
    .offer-link{
        text-decoration: none;
        color: #333;
    }
	article {
		max-width: 900px;
		margin: 25px auto;
		background-color: #95eaff;
		padding: 20px;
	}

	img {
		width: 100px;
	}
</style>
