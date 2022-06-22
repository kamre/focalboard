import React from 'react'

import {FormattedMessage} from 'react-intl'

import {Board} from '../blocks/board'
import {BoardView} from '../blocks/boardView'
import {Card} from '../blocks/card'
import {CommentBlock} from '../blocks/commentBlock'
import {ContentBlock} from '../blocks/contentBlock'

import CardDetail from './cardDetail/cardDetail'

type Props = {
    board: Board
    activeView: BoardView
    views: BoardView[]
    cards: Card[]
    card?: Card
    comments: CommentBlock[]
    contents: Array<ContentBlock|ContentBlock[]>
    readonly: boolean
    isTemplate?: boolean
}

const CardContent = (props: Props): JSX.Element => {
    const {board, activeView, views, cards, card, comments, contents, readonly, isTemplate} = props
    return (
        <>
            {isTemplate &&
                <div className='banner'>
                    <FormattedMessage
                        id='CardDialog.editing-template'
                        defaultMessage="You're editing a template."
                    />
                </div>}

            {card &&
                <CardDetail
                    board={board}
                    activeView={activeView}
                    views={views}
                    cards={cards}
                    card={card}
                    contents={contents}
                    comments={comments}
                    readonly={readonly}
                />}

            {!card &&
                <div className='banner error'>
                    <FormattedMessage
                        id='CardDialog.nocard'
                        defaultMessage="This card doesn't exist or is inaccessible."
                    />
                </div>}
        </>
    )
}

export default React.memo(CardContent)
