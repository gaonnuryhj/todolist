package kr.or.connect.todo.persistence;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import kr.or.connect.todo.domain.Todo;

@Repository
public class TodoDao {
	private NamedParameterJdbcTemplate jdbc;
	private SimpleJdbcInsert insertAction;

	public TodoDao(DataSource dataSource) {
		this.jdbc = new NamedParameterJdbcTemplate(dataSource);
		this.insertAction = new SimpleJdbcInsert(dataSource).withTableName("todo").usingColumns("todo")
				.usingGeneratedKeyColumns("id");
	}

	private static final String SELECT_ALL = "SELECT id, todo, completed,date FROM todo";

	//// Select

	private static final String COUNT_TODO = "SELECT COUNT(*) FROM todo";

	public int countTodos() {
		Map<String, Object> params = Collections.emptyMap();
		return jdbc.queryForObject(COUNT_TODO, params, Integer.class);
	}

	private static final String SELECT_BY_ID = "SELECT id, todo, completed,date FROM todo where id = :id";

	public Todo selectById(Integer id) {
		Map<String, Object> params = new HashMap<>();
		params.put("id", id);
		return jdbc.queryForObject(SELECT_BY_ID, params, rowMapper);
	}

	//// Insert
	public Integer insert(Todo todo) {
		SqlParameterSource params = new BeanPropertySqlParameterSource(todo);
		return insertAction.executeAndReturnKey(params).intValue();
	}

	///// Delete
	static final String DELETE_BY_ID = "DELETE FROM todo WHERE id= :id";

	public int deleteById(Integer id) {
		Map<String, ?> params = Collections.singletonMap("id", id);
		return jdbc.update(DELETE_BY_ID, params);
		
	}
	
	
	static final String DELETE_BY_COMPLETED = "DELETE FROM todo WHERE completed=1";
	public int deleteByCompleted() {
		Map<String, Object> params = Collections.emptyMap();
		return jdbc.update(DELETE_BY_COMPLETED, params);
	}
	
	//// Update
	private static final String UPDATE = "UPDATE todo SET\n" + "completed = :completed\n" + "WHERE id = :id";

	public int update(Todo todo) {
		SqlParameterSource params = new BeanPropertySqlParameterSource(todo);
		return jdbc.update(UPDATE, params);
	}

	private RowMapper<Todo> rowMapper = BeanPropertyRowMapper.newInstance(Todo.class);

	public List<Todo> selectAll() {
		Map<String, Object> params = Collections.emptyMap();
		return jdbc.query(SELECT_ALL, params, rowMapper);
	}
	
}
