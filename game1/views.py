import chess
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
import pandas as pd
from .models import ChessMoves

def home_nope(request):
    try:
        # Read the CSV file
        data = pd.read_csv('lichess-08-2014.csv')        
        # Iterate over the DataFrame rows and save each instance individually
        for i, row in data.iterrows():
            if i==1000:
                break
            chess_move = ChessMoves(
                Mode=row['Mode'],  # Assuming the CSV has a 'Mode' column
                move=parse_moves(row['PGN']),  
                Termination_Type=row['Termination Type']  # Assuming the CSV has this column
            )
            chess_move.save()  # Save the instance to the database
            print(f"Saved move with ID {row['Unnamed: 0']}")
    except Exception as e:
        return HttpResponse(f'Error: {e}')
    return render(request, 'game1/index.html', {'data': data})

import chess

import chess

def parse_moves(moves_str):
    # Create a new board
    board = chess.Board()
    
    # Parse the moves
    moves = moves_str.split()
    
    # To store the detailed moves
    detailed_moves = []
    
    for move in moves:
        if move.endswith('.'):
            # Skip the move numbers
            continue
        
        # Store the current turn before making the move
        turn = board.turn
        
        try:
            # Try to push the move in SAN format
            move_obj = board.push_san(move)
        except ValueError:
            # Handle potential errors in move parsing
            print(f"Invalid move: {move}")
            continue
        
        # Extract the move in UCI format
        move_uci = move_obj.uci()
        
        # Create the detailed move dictionary for the king
        detailed_move = {
            'from': move_uci[:2],
            'to': move_uci[2:]
        }
        
        # Check if the move results in a check
        if board.is_check():
            detailed_move['check'] = True
            enemy_king_position = None
            enemy_color = not board.turn  # Determine the color of the enemy king
            for square, piece in board.piece_map().items():
                if piece.symbol() == 'k' and piece.color != enemy_color:
                    enemy_king_position = square
                    break
            if enemy_king_position:
                detailed_move['enemy_king_position'] = chess.square_name(enemy_king_position)


            
        if board.is_checkmate():
            detailed_move['checkmate'] = True
            detailed_move['checkmate_by'] = 'Black' if turn == chess.WHITE else 'White'
            detailed_move['checkmate_to'] = 'White' if turn == chess.WHITE else 'Black'
        # Handle castling moves specifically
        if move == 'O-O':  # Kingside castling
            detailed_moves.append(detailed_move)  # Add king's move
            rook_move = {
                'from': 'h1' if turn == chess.WHITE else 'h8',
                'to': 'f1' if turn == chess.WHITE else 'f8'
            }
            detailed_moves.append(rook_move)  # Add rook's move
        elif move == 'O-O-O':  # Queenside castling
            detailed_moves.append(detailed_move)  # Add king's move
            rook_move = {
                'from': 'a1' if turn == chess.WHITE else 'a8',
                'to': 'd1' if turn == chess.WHITE else 'd8'
            }
            detailed_moves.append(rook_move)  # Add rook's move
        else:
            detailed_moves.append(detailed_move)  # Add regular move
        
        # Add promotion piece if applicable
        if len(move_uci) > 4:
            detailed_move['promotion'] = move_uci[4]
    
    return detailed_moves

def home(request):
    return render(request,'game1/index.html')

def getdata(request):
    random_move = ChessMoves.objects.order_by('?').first()
    print(random_move.move)
    return JsonResponse(random_move.move,safe=False)
