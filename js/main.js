let game;
game = new Game();
game.createWatermark()
game.registerAdminAccount()
if (game.checkLogin()) {
    game.createlobby()
    game.createNavbar('game')
} else {
    game.createLogin()
    game.createNavbar('main')
}

window.onload = function () {
    const data = JSON.parse(localStorage.getItem('data'))
    if (data != null) {
        data.forEach((acc, i) => {
            if (acc.login) {
                const account = new Account(game.accountName, game.firstName, game.lastName, game.email, game.passWord, game.highScore, game.id, game.login, game.shadows, game.shadowsCatcher, game.shading, game.fog, game.fps, game.music, game.lensFlare, game.slowMo)
                game.logIn(account)
                game.login = true;
                data[i] = account;
            }
        })
    }
}

