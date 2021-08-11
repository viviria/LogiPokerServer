const CreateUserID = () => {
    return localStorage.getItem('LogiPokerUserID') || Math.random().toString(32).substring(2) + Date.now()
}
