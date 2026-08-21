erDiagram
	direction TB
	USUARIO {
		int id_usuario PK ""  
		string nombre  ""  
		string correo  ""  
		string contrasena  ""  
		string codigo_verificacion  ""  
	}

	PASSWORD_RESET_TOKEN {
		int id PK ""  
		int id_usuario FK ""  
		string token  ""  
		datetime created_at  ""  
		datetime expiration  ""  
	}

	MATERIA {
		int id_materia PK ""  
		int id_usuario FK ""  
		string nombre_materia  ""  
		string codigo  ""  
		string color_hex  ""  
	}

	CUADERNO {
		int id_cuaderno PK ""  
		int id_usuario FK ""  
		int id_materia FK ""  
		string nombre_cuaderno  ""  
		text contenido  ""  
		boolean modo_oscuro  ""  
	}

	MAZO {
		int id_mazo PK ""  
		int id_usuario FK ""  
		int id_materia FK ""  
		string nombre_mazo  ""  
	}

	FLASHCARD {
		int id_flashcard PK ""  
		int id_mazo FK ""  
		string pista  ""  
		string respuesta  ""  
		datetime fecha_creacion  ""  
	}

	GRUPO_NOTA {
		int id_nota PK ""  
		int id_materia FK ""  
		int num_grupo  ""  
		float porcentaje  ""  
		float nota  ""  
	}

	HORARIO {
		int id_horario PK ""  
		int id_materia FK ""  
		string evento  ""  
		time hora_inicio  ""  
		time hora_fin  ""  
		string dia_semana  ""  
	}

	RECORDATORIO {
		int id_recordatorio PK ""  
		int id_usuario FK ""  
		int id_horario FK ""  
		string nombre_recordatorio  ""  
		datetime fecha_hora  ""  
	}

	TRAZA {
		int id_traza PK ""  
		int id_usuario FK ""  
		string nombre  ""  
		string descripcion  ""  
		string hora  ""  
		string servicio  ""  
	}

	USUARIO||--o{PASSWORD_RESET_TOKEN:"solicita"
	USUARIO||--o{MATERIA:"cursa"
	USUARIO||--o{RECORDATORIO:"programa"
	USUARIO||--o{TRAZA:"registra"
	MATERIA||--o{CUADERNO:"agrupa"
	MATERIA||--o{MAZO:"clasifica"
	MATERIA||--o{GRUPO_NOTA:"pondera"
	MATERIA||--o{HORARIO:"asigna"
	MAZO||--o{FLASHCARD:"contiene"
	HORARIO||--o{RECORDATORIO:"Genera"