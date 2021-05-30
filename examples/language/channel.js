const { PollChannel } = require('downstream');

const SENTENCES = [
    'The quick brown fox jumps over the lazy dog and escapes into the night.',
    'El veloz zorro marrón salta sobre el perro perezoso y se escapa a la noche.',
    'Быстрая коричневая лисица перепрыгивает через ленивую собаку и убегает в ночь.',
    '敏捷的棕色狐狸跳过了那只懒狗，逃到了黑夜。',
]

class LanguageChannel extends PollChannel {

    async fetch() {
        const sentence = SENTENCES.shift();
        SENTENCES.push(sentence);
    
        this.enqueue({ sentence });
    }

}

module.exports = LanguageChannel;