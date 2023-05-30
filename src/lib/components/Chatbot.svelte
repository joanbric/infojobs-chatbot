<script>
	import { deserialize } from '$app/forms';
	import Elliebot from './Elliebot.svelte';
	import { beforeUpdate, afterUpdate } from 'svelte';

	let messagesContainer;
	let autoscroll;

	beforeUpdate(() => {
		if (!isChatVisible) return null;
		autoscroll =
			messagesContainer &&
			messagesContainer.offsetHeight + messagesContainer.scrollTop >
				messagesContainer.scrollHeight - 20;
	});

	afterUpdate(() => {
		if (autoscroll && isChatVisible) messagesContainer.scrollTo(0, messagesContainer.scrollHeight);
	});
	let isMessageVisible = true;
	let isChatVisible = false;

	function closeMessage() {
		isMessageVisible = false;
	}
	function showChat() {
		isChatVisible = true;
	}
	function closeChat() {
		isChatVisible = false;
		isMessageVisible = true;
	}
	let chat = [{ author: 'bot', message: 'Dime ¿como puedo ayudarte?' }];

	async function handlerInputEnter(e) {
		if (e.key !== 'Enter') return null;
		const message = e.target.value;
		if (!message) return null;

		chat = chat.concat({
			author: 'user',
			message
		});
		e.target.value = '';

		const formData = new FormData();
		formData.append('msg', message);
		const res = await fetch('?/ai', {
			method: 'post',
			body: formData
		});

		/** @type {import('@sveltejs/kit').ActionResult}*/
		const data = deserialize(await res.text());

		chat = chat.concat({
			author: 'bot',
			message: data.data.content
		});
	}

	function addMessage(author, message) {
		chat.concat({
			author,
			message
		});
	}
</script>

<div class="chatbot-container">
	{#if isChatVisible}
		<div class="chat-container">
			<button class="btn-close-chat" on:click={closeChat}><i class="bx bx-x" /></button>
			<div class="messages-container" bind:this={messagesContainer}>
				{#each chat as msg, index}
					<div class="message-container">
						{#if index === chat.length - 1 && msg.author === 'bot'}
							<div class="chat-container__bot-logo">
								<Elliebot />
							</div>
						{/if}
						<p class="message {msg.author === 'bot' ? 'bot' : 'user'}">{msg.message}</p>
					</div>
				{/each}
			</div>
			<div class="message-input-container">
				<input
					type="text"
					name="message"
					id="message"
					placeholder="Escribe tu mensaje..."
					on:keydown={handlerInputEnter}
				/>
				<i class="bx bx-send" />
			</div>
		</div>
	{:else}
		<div class="bot-logo">
			{#if isMessageVisible}
				<div class="message-floating">
					<button on:click={closeMessage} class="btn-close"><i class="bx bx-x" /></button>
					<p>Hola soy Ellie tu asistente virutal</p>
					<p>
						Estoy aqui para ayudarte con cualquier duda o consulta que tengas respecto a la busqueda
						de trabajo
					</p>
				</div>
			{/if}
			<button on:click={showChat}>
				<Elliebot />
			</button>
		</div>
	{/if}
</div>

<style>
	.chatbot-container {
		position: fixed;
		bottom: 15px;
		right: 15px;
	}
	.message,
	.message-floating {
		background-color: #fff;
		padding: 5px 10px;
	}
	.message-floating {
		box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
		border-radius: 12px 12px 0 12px;
		position: absolute;
		width: 300px;
		right: 80%;
		bottom: 70%;
	}
	.message-floating p {
		padding: 5px 10px;
	}
	button {
		border: none;
		background: none;
	}
    

	.message-floating .btn-close,
	.btn-close-chat {
		position: absolute;
		top: 5px;
		right: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.3rem;
		color: red;
	}
	.bot-logo {
		position: absolute;
		right: 0;
		bottom: 0;

		width: 80px;
	}

	/* CHAT */

	.chat-container {
		background-color: #baeaff;
		max-width: 450px;
		padding: 10px 15px;
		border-radius: 12px;
	}

	.chat-container .message {
		margin: 10px 0;
	}

	.chat-container .message.bot {
		border-radius: 1em 1em 1em 0px;
		background-color: #02648e;
		color: white;
	}
	.chat-container .message.user {
		border-radius: 1em 1em 0 1em;
	}

	.chat-container__bot-logo {
		min-width: 50px;
	}

	.messages-container {
		overflow: auto;
		max-height: 750px;
	}
	.message-container {
		display: flex;
		align-items: flex-end;
	}

	/* Message input */
	.message-input-container {
		background-color: #fff;
		border-radius: 8px;
		overflow: hidden;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 0 5px;
	}

	.message-input-container input {
		border: none;
		padding: 10px 5px;
		flex-grow: 1;
	}
</style>
