from game.models import Game

class PongConsumer(WebsocketConsumer):
    # ...

    def start_game(self, data):
        player_one = User.objects.get(username=data['player_one'])
        player_two = User.objects.get(username=data['player_two'])
        difficulty = data.get('difficulty', 'EASY')
        level = data.get('level', 'CLASSIC')

        game = Game.objects.create(
            player_one=player_one,
            player_two=player_two,
            difficulty=difficulty,
            level=level,
            status='ONGOING'
        )
        self.game_id = game.id

        # Envoyer un message aux clients pour informer que le jeu a commencé
        self.send(text_data=json.dumps({
            'type': 'game_started',
            'game_id': self.game_id,
            'player_one': player_one.username,
            'player_two': player_two.username,
        }))

    # ...
    

	class PongConsumer(WebsocketConsumer):
    # ...

    def end_game(self, data):
        game = Game.objects.get(id=self.game_id)
        game.score_one = data['score_one']
        game.score_two = data['score_two']
        game.status = 'COMPLETED'
        game.end_time = timezone.now()

        if data['score_one'] > data['score_two']:
            game.winner = game.player_one
        elif data['score_two'] > data['score_one']:
            game.winner = game.player_two

        game.save()

        # Envoyer un message aux clients pour informer que le jeu est terminé
        self.send(text_data=json.dumps({
            'type': 'game_ended',
            'game_id': self.game_id,
            'score_one': game.score_one,
            'score_two': game.score_two,
            'winner': game.winner.username if game.winner else None,
        }))

    # ...
    

	class PongConsumer(WebsocketConsumer):
    # ...

    def receive(self, text_data):
        data = json.loads(text_data)

        if data['type'] == 'start_game':
            self.start_game(data)
        elif data['type'] == 'end_game':
            self.end_game(data)
        # Autres types de données...

    # ...
    
	function startGame(playerOne, playerTwo, difficulty, level) {
    const data = {
        type: 'start_game',
        player_one: playerOne,
        player_two: playerTwo,
        difficulty: difficulty,
        level: level
    };
    gameSocket.send(JSON.stringify(data));
}

function endGame(scoreOne, scoreTwo) {
    const data = {
        type: 'end_game',
        score_one: scoreOne,
        score_two: scoreTwo
    };
    gameSocket.send(JSON.stringify(data));
}