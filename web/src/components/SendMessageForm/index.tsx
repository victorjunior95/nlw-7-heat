import { useContext, useState, FormEvent } from 'react';
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc';
import { AuthContext } from '../../contexts/auth';
import { api } from '../../services/api';
import styles from './styles.module.scss';

export function SendMessageForm() {
  const { user, signOut } = useContext(AuthContext);
  const [message, setMessage] = useState('');

  const handleSendMessage = async (event: FormEvent) => {
    event.preventDefault();

    // se o texto estiver vazio, msm removendo os espaços(.trim())
    if (!message.trim()) {
      return; // !message.trim() || return;
    }

    await api.post('messages', { message });

    // limpa o campo de input textarea
    setMessage('');
  }

  return (
    <div className={styles.SendMessageFormWrapper}>
      <button onClick={signOut} className={styles.signOutButton}>
        <VscSignOut size="32" />
      </button>

      <header className={styles.userInformation}>
        <div className={styles.userImage}>
          {/* '?' pq user pode estar null, então faz uma verificação antes */}
          <img src={user?.avatar_url} alt={user?.name} />
          <strong className={styles.userName}>{user?.name}</strong>
          <span className={styles.userGithub}>
            <VscGithubInverted size="16" />
            {user?.login}
          </span>
        </div>
      </header>

      <form onSubmit={handleSendMessage} className={styles.sendMessageForm}>
        <label htmlFor="message">Mensagem</label>
        <textarea
          name="message"
          id="message"
          placeholder="Qual sua expectativa para o evento?"
          onChange={event => setMessage(event.target.value)}
          value={message}
        />

        <button type="submit">Enviar mensagem</button>
      </form>
    </div>
  )
}